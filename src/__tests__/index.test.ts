import { Context } from '@semantic-release/commit-analyzer';
import { PluginConfig, analyzeCommits } from '..';

describe('analyzeCommits', () => {
  it('should filter out unrelated commits', async () => {
    const ctx: Context = {
      commits: [
        {
          hash: '123',
          message: 'fix: bug',
        },
        {
          hash: '456',
          message: 'feat: major feature',
        },
      ] as any,
      cwd: '/opt/test',
      env: {},
      logger: {
        log: jest.fn(),
      },
    };
    const pluginConfig: PluginConfig = {
      subtree: ['packages/1'],
      getCommitList: async () => [{ hash: '123' }],
    };
    const bump = await analyzeCommits(pluginConfig, ctx);
    expect(bump).toBe('patch');
  });
  it('should not filter if all commits match', async () => {
    const ctx: Context = {
      commits: [
        {
          hash: '123',
          message: 'fix: bug',
        },
        {
          hash: '456',
          message: 'feat: major feature',
        },
      ] as any,
      cwd: '/opt/test',
      env: {},
      logger: {
        log: jest.fn(),
      },
    };
    const pluginConfig: PluginConfig = {
      subtree: ['packages/1'],
      getCommitList: async () => [{ hash: '123' }, { hash: '456' }],
    };
    const bump = await analyzeCommits(pluginConfig, ctx);
    expect(bump).toBe('minor');
  });
});
