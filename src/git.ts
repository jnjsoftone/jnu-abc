/** Github
 * References
 *   - [create repository](https://octokit.github.io/rest.js/v19#repos-create-for-authenticated-user)
 */

// & Import AREA
// &---------------------------------------------------------------------------
import Path from 'path';

// ? External Modules
import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';

// ? Internal Modules
import { loadJson } from './builtin.js';
import { sleep } from './basic.js';
import { PLATFORM } from './cli.js';

// & Types AREA
// &---------------------------------------------------------------------------
import type { GithubAccount, RepoOptions } from './types.js';

// & Variables AREA
// &---------------------------------------------------------------------------
const settingsPath = `${process.env.DEV_ROOT}/jd-environments` ?? 'C:/JnJ/Developments/jd-environments';

// & Functions AREA
// &---------------------------------------------------------------------------
/**
 * Github 계정 정보 조회
 * @param userName - Github 사용자명
 * @returns Github 계정 정보
 *
 * @example
 * ```ts
 * const account = findGithubAccount('username');
 * ```
 */
const findGithubAccount = (userName: string): GithubAccount => {
  return loadJson(`${settingsPath}/Apis/github.json`)[userName];
};

/**
 * 모든 저장소 목록 조회
 */
const findAllRepos = async (octokit: Octokit) => {
  const response = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100, // 페이지당 결과 수
    sort: 'updated', // 업데이트 순으로 정렬
  });
  return response.data;
};

/**
 * 새 저장소 생성
 */
const createRemoteRepo = (octokit: Octokit, options: RepoOptions) => {
  console.log('####@@@@@ createRemoteRepo options: ', options);
  const { name, description, isPrivate } = options;
  // console.log('####@@@@@===== private: ', isPrivate);
  // const defaults = {
  //   auto_init: true,
  //   private: isPrivate,
  //   license_template: 'MIT',
  // };
  return octokit.rest.repos.createForAuthenticatedUser({
    name,
    description,
    private: isPrivate, // true로 설정하면 private 저장소가 됨
    auto_init: true,
  });
};

/**
 * 저장소 삭제
 */
const deleteRemoteRepo = (octokit: Octokit, options: RepoOptions, account: GithubAccount) => {
  const { name } = options;
  console.log(`### deleteRemoteRepo: ${name}`);
  return octokit.rest.repos.delete({
    owner: account.userName,
    repo: name,
  });
};

/**
 * Git 설정 변경
 */
const setLocalConfig = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  let cmd = `cd ${localPath} && git config user.name "${account.fullName}"`;
  cmd += ` && git config user.email "${account.email}"`;
  cmd += ` && git remote set-url origin https://${account.token}@github.com/${account.userName}/${options.name}.git`;
  console.log(cmd);
  execSync(cmd);
};

/**
 * 로컬 저장소 초기화
 */
const initLocalRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  const { name } = options;
  const { fullName, email, token, userName } = account;

  let cmd = `cd ${localPath} && git init`;
  execSync(cmd);
  try {
    cmd = `git branch -m master main`; // 기본 브랜치 이름 변경(master -> main)
    execSync(cmd);
  } catch (error) {
    console.log('####@@@@@===== error: ', error);
  }
  cmd = `git config user.name "${fullName}"`;
  cmd += ` && git config user.email "${email}"`;
  cmd += ` && git remote add origin https://${token}@github.com/${userName}/${name}.git`;
  // cmd += ` && git remote set-url origin https://${account.token}@github.com/${account.userName}/${options.name}.git`;
  cmd += ` && git add . && git commit -m "Initial commit"`;
  console.log(cmd);
  execSync(cmd);
};

/**
 * 저장소 복제
 */
const cloneRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  const cmd = `cd ${Path.dirname(localPath)} && git clone https://${account.token}@github.com/${account.userName}/${
    options.name
  }.git`;
  console.log(cmd);
  execSync(cmd);
};

/**
 * 저장소 초기화 (생성, 복제, 설정)
 */
const initRepo = (octokit: Octokit, options: RepoOptions, account: GithubAccount, localPath: string) => {
  // createRemoteRepo(octokit, options); // !! 원격 저장소 생성 안됨
  let cmd = `xgit -e createRemoteRepo -u ${account.userName} -n ${options.name} -d "${options.description}" -p ${options.isPrivate}`;
  console.log(`initRepo cmd: ${cmd}`);
  execSync(cmd);
  sleep(10);
  cloneRepo(options, account, localPath);
  sleep(5);
  setLocalConfig(options, account, localPath);
};

/**
 * 저장소 복제 및 설정
 */
const copyRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  cloneRepo(options, account, localPath);
  sleep(10);
  setLocalConfig(options, account, localPath);
};

/**
 * 저장소에 변경사항 푸시
 */
const pushRepo = (options: RepoOptions, account: GithubAccount, localPath: string) => {
  execSync(`cd ${localPath}`);

  // 변경사항이 있는지 확인
  const status = execSync('git status --porcelain', { encoding: 'utf8' });

  // 변경사항이 있으면 커밋
  if (status.length > 0) {
    const cmd = `git add . && git commit -m "Initial commit"`;
    console.log('#### ', cmd);
    execSync(cmd);
  }

  const branches = execSync('git branch');
  console.log(`#### pushRepo branches: ${branches}`);

  if (branches.includes('main')) {
    execSync('git push -u origin main --force');
  } else if (branches.includes('master')) {
    execSync('git push -u origin master --force');
  } else {
    console.log('main 또는 master 브랜치가 없습니다.');
  }
};

/**
 * 새 저장소 생성 및 초기 커밋
 */
const makeRepo = (octokit: Octokit, options: RepoOptions, account: GithubAccount, localPath: string) => {
  // // 빈 저장소 생성
  // createRemoteRepo(octokit, options);
  console.log('####@@@@@===== makeRepo options: ', JSON.stringify(options));
  let cmd = `xgit -e createRemoteRepo -u ${account.userName} -n ${options.name} -d "${options.description}" -p ${options.isPrivate}`;
  console.log(`initRepo cmd: ${cmd}`);
  execSync(cmd);
  sleep(15);
  // 로컬 저장소 초기화
  console.log(`=================== initLocalRepo: ${localPath}`);
  initLocalRepo(options, account, localPath);
  sleep(5);
  // 초기 커밋 및 푸시
  console.log(`=================== pushRepo: ${localPath}`);
  pushRepo(options, account, localPath);
};

/**
 * 로컬 + 원격 저장소 삭제
 */
const removeRepo = (octokit: Octokit, options: RepoOptions, account: GithubAccount, localPath: string) => {
  deleteRemoteRepo(octokit, options, account);
  sleep(10);
  const { name } = options;

  if (PLATFORM === 'win') {
    // Windows에서는 각 명령어를 개별적으로 실행
    try {
      const cdCmd = `cd ${Path.dirname(localPath)}`;
      console.log(cdCmd);
      execSync(cdCmd);

      const rmCmd = `rmdir /s /q ${name}`;
      console.log(rmCmd);
      execSync(rmCmd);
    } catch (error) {
      console.error('Failed to remove directory:', error);
      // 실패 시 대체 방법 시도
      try {
        const altCmd = `rd /s /q "${localPath}"`;
        console.log('Trying alternative command:', altCmd);
        execSync(altCmd);
      } catch (err) {
        console.error('Alternative removal also failed:', err);
      }
    }
  } else {
    // Unix 계열은 한 번에 실행
    const cmd = `cd ${Path.dirname(localPath)} && rm -rf ${name}`;
    console.log(cmd);
    execSync(cmd);
  }
};

// & Export AREA
// &---------------------------------------------------------------------------
export {
  findGithubAccount,
  findAllRepos,
  createRemoteRepo,
  deleteRemoteRepo,
  cloneRepo,
  setLocalConfig,
  initLocalRepo,
  initRepo,
  copyRepo,
  pushRepo,
  makeRepo,
  removeRepo,
};
