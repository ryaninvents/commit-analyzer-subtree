import {
  analyzeCommits as upstreamAnalyzeCommits,
  PluginConfig as UpstreamPluginConfig,
  Context,
} from '@semantic-release/commit-analyzer';
import log from 'git-log-parser';
import getStream from 'get-stream';

Object.assign(log.fields, { hash: 'H' });

export type PluginConfig = UpstreamPluginConfig & {
  subtree: Array<string>;
  getCommitList?: typeof defaultGetCommitList;
};

export async function analyzeCommits(
  pluginConfig: PluginConfig,
  context: Context
) {
  /** Simple lookup table; when a commit matches the desired subtree, add it to this lookup. */
  const lookup: { [commitHash: string]: true } = {};

  const {
    subtree,
    getCommitList = defaultGetCommitList,
    ...restConfig
  } = pluginConfig;
  context.logger.log('Filtering commits by subtree: {%s}', subtree.join(', '));

  const {
    lastRelease: { gitHead: from = null } = {},
    nextRelease: { gitHead: to = 'HEAD' } = {},
    cwd,
    env = {},
  } = context;

  const commits: Promise<Array<{ hash: string }>> = getCommitList(
    from,
    to,
    subtree,
    cwd,
    env
  );

  for (let commit of await commits) {
    lookup[commit.hash] = true;
  }

  const filteredCommits = context.commits.filter(({ hash }) => hash in lookup);
  context.logger.log(
    'Found %d commits matching subtree',
    filteredCommits.length
  );
  return upstreamAnalyzeCommits(restConfig, {
    ...context,
    commits: filteredCommits,
  });
}

function defaultGetCommitList(
  from: string,
  to: string,
  subtree: string[],
  cwd: string,
  env: { [key: string]: string }
): Promise<{ hash: string }[]> {
  return getStream.array(
    log.parse(
      {
        _: [from ? `${from}..${to}` : to, '--', ...subtree],
      },
      { cwd, env: { ...process.env, ...env } }
    )
  ) as any;
}
