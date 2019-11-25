declare module '@semantic-release/commit-analyzer' {
  export type GitRef = {
    gitHead: string;
  };
  export type Commit = {
    hash: string;
    author: Author;
    committer: Author;
    subject: string;
    body: string;
    message: string;
    committerDate: string;
    gitTags: string;
  };
  export type Author = {
    name: string;
    email: string;
    date: string;
  };
  export type PluginConfig = {};
  export type Logger = {
    log: (message?: string, ...args: Array<any>) => void;
  };
  export type Context = {
    commits: Array<Commit>;
    cwd: string;
    env: {
      [key: string]: string;
    };
    lastRelease?: GitRef;
    nextRelease?: GitRef;
    logger: Logger;
  };
  export type ReleaseType = 'major' | 'minor' | 'patch' | false;
  export function analyzeCommits(
    pluginConfig: PluginConfig,
    context: Context
  ): Promise<ReleaseType>;
}
