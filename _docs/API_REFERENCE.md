# API 참조 문서
## JNU-ABC: TypeScript 유틸리티 라이브러리

### 📋 목차
1. [설치 및 설정](#설치-및-설정)
2. [데이터 조작 함수](#데이터-조작-함수)
3. [파일 시스템 작업](#파일-시스템-작업)
4. [날짜 및 시간 유틸리티](#날짜-및-시간-유틸리티)
5. [플랫폼 유틸리티](#플랫폼-유틸리티)
6. [타입 정의](#타입-정의)
7. [예제 및 레시피](#예제-및-레시피)

---

## 📦 설치 및 설정

```bash
# 의존성으로 설치
npm install jnu-abc

# 개발용으로 설치
npm install --save-dev jnu-abc
```

### 임포트 방법
```typescript
// 특정 함수 임포트 (권장)
import { loadJson, saveJson, arrFromDicts } from 'jnu-abc';

// 모든 함수 임포트
import * as jnuAbc from 'jnu-abc';

// CommonJS 임포트
const { loadJson, saveJson } = require('jnu-abc');
```

---

## 🔧 데이터 조작 함수

### 객체 작업

#### `popDict<T>(dict: T, keys: string[]): Partial<T>`
객체에서 특정 키를 제거하고 새 객체를 반환합니다.

```typescript
import { popDict } from 'jnu-abc';

const user = { name: 'John', age: 30, email: 'john@example.com', password: 'secret' };
const publicUser = popDict(user, ['password']);
// 결과: { name: 'John', age: 30, email: 'john@example.com' }
```

#### `renameKeys<T>(dict: T, keyMap: Record<string, string>): T`
매핑에 따라 객체 키의 이름을 변경합니다.

```typescript
import { renameKeys } from 'jnu-abc';

const data = { firstName: 'John', lastName: 'Doe' };
const renamed = renameKeys(data, { firstName: 'first_name', lastName: 'last_name' });
// 결과: { first_name: 'John', last_name: 'Doe' }
```

#### `overwriteKeys<T>(target: T, source: Partial<T>): T`
소스 값으로 타겟 값을 덮어쓰는 방식으로 객체를 병합합니다.

```typescript
import { overwriteKeys } from 'jnu-abc';

const defaults = { theme: 'light', language: 'en', debug: false };
const userConfig = { theme: 'dark', debug: true };
const config = overwriteKeys(defaults, userConfig);
// 결과: { theme: 'dark', language: 'en', debug: true }
```

#### `swapDict<T>(dict: Record<string, T>): Record<T, string>`
객체의 키와 값을 서로 교체합니다.

```typescript
import { swapDict } from 'jnu-abc';

const statusCodes = { ok: '200', notFound: '404', error: '500' };
const codeToStatus = swapDict(statusCodes);
// 결과: { '200': 'ok', '404': 'notFound', '500': 'error' }
```

### 배열 작업

#### `arrFromDicts<T>(dicts: T[], key: keyof T): Array<T[keyof T]>`
객체 배열에서 특정 키의 값을 추출합니다.

```typescript
import { arrFromDicts } from 'jnu-abc';

const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
];
const names = arrFromDicts(users, 'name');
// 결과: ['John', 'Jane', 'Bob']
```

#### `dictsFromRows(headers: string[], rows: any[][]): any[]`
헤더와 함께 2D 배열을 객체 배열로 변환합니다.

```typescript
import { dictsFromRows } from 'jnu-abc';

const headers = ['name', 'age', 'city'];
const rows = [
  ['John', 30, 'New York'],
  ['Jane', 25, 'London'],
  ['Bob', 35, 'Tokyo']
];
const users = dictsFromRows(headers, rows);
// 결과: [
//   { name: 'John', age: 30, city: 'New York' },
//   { name: 'Jane', age: 25, city: 'London' },
//   { name: 'Bob', age: 35, city: 'Tokyo' }
// ]
```

#### `rowsFromDicts<T>(dicts: T[]): any[][]`
객체 배열을 2D 배열로 변환합니다.

```typescript
import { rowsFromDicts } from 'jnu-abc';

const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];
const rows = rowsFromDicts(users);
// 결과: [['John', 30], ['Jane', 25]]
```

### CSV 작업

#### `rowsFromCsv(csvString: string, delimiter?: string): string[][]`
CSV 문자열을 2D 배열로 파싱합니다.

```typescript
import { rowsFromCsv } from 'jnu-abc';

const csvData = `name,age,city
John,30,New York
Jane,25,London`;

const rows = rowsFromCsv(csvData);
// 결과: [
//   ['name', 'age', 'city'],
//   ['John', '30', 'New York'],
//   ['Jane', '25', 'London']
// ]

// 커스텀 구분자
const tsvData = "name\tage\tcity\nJohn\t30\tNew York";
const tsvRows = rowsFromCsv(tsvData, '\t');
```

#### `csvFromRows(rows: any[][], delimiter?: string): string`
2D 배열을 CSV 문자열로 변환합니다.

```typescript
import { csvFromRows } from 'jnu-abc';

const data = [
  ['name', 'age', 'city'],
  ['John', 30, 'New York'],
  ['Jane', 25, 'London']
];
const csv = csvFromRows(data);
// 결과: "name,age,city\nJohn,30,New York\nJane,25,London"
```

---

## 📁 파일 시스템 작업

### JSON 파일 작업

#### `loadJson<T>(filePath: string): T`
JSON 파일을 로드하고 파싱합니다.

```typescript
import { loadJson } from 'jnu-abc';

// 설정 로드
interface Config {
  apiUrl: string;
  timeout: number;
  features: string[];
}

const config = loadJson<Config>('./config.json');
console.log(config.apiUrl);
```

#### `saveJson<T>(filePath: string, data: T, options?: JsonOptions): void`
데이터를 JSON 파일로 저장합니다.

```typescript
import { saveJson } from 'jnu-abc';

const userData = {
  users: [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ]
};

// 예쁜 포맷팅으로 저장
saveJson('./users.json', userData, { indent: 2 });

// 압축된 형태로 저장
saveJson('./users.min.json', userData);
```

### 일반 파일 작업

#### `loadFile(filePath: string): string`
파일 내용을 문자열로 읽습니다.

```typescript
import { loadFile } from 'jnu-abc';

const template = loadFile('./templates/email.html');
const readme = loadFile('./README.md');
```

#### `saveFile(filePath: string, content: string, options?: FileOptions): void`
문자열 내용을 파일에 씁니다.

```typescript
import { saveFile } from 'jnu-abc';

const htmlContent = `
<html>
  <head><title>생성된 리포트</title></head>
  <body><h1>리포트</h1></body>
</html>
`;

saveFile('./output/report.html', htmlContent);

// 옵션과 함께
saveFile('./logs/app.log', logMessage, { 
  overwrite: false,  // 파일이 존재하면 추가
  encoding: 'utf8' 
});
```

### 환경 파일

#### `loadEnv(filePath: string): Record<string, string>`
.env 파일에서 환경 변수를 로드합니다.

```typescript
import { loadEnv } from 'jnu-abc';

// .env 파일 로드
const env = loadEnv('./.env');
console.log(env.DATABASE_URL);

// 환경별 파일 로드
const devEnv = loadEnv('./.env.development');
```

#### `saveEnv(filePath: string, env: Record<string, string>): void`
환경 변수를 .env 파일에 저장합니다.

```typescript
import { saveEnv } from 'jnu-abc';

const environmentConfig = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgres://localhost:5432/myapp',
  API_KEY: 'your-api-key-here'
};

saveEnv('./.env.production', environmentConfig);
```

### 디렉토리 작업

#### `makeDir(dirPath: string): void`
디렉토리를 재귀적으로 생성합니다.

```typescript
import { makeDir } from 'jnu-abc';

// 중첩 디렉토리 생성
makeDir('./output/reports/2024');
makeDir('./temp/cache');
```

#### `copyDir(srcPath: string, destPath: string): void`
디렉토리를 재귀적으로 복사합니다.

```typescript
import { copyDir } from 'jnu-abc';

// 템플릿을 새 프로젝트에 복사
copyDir('./templates/react-app', './projects/my-new-app');

// 설정 백업
copyDir('./config', './backups/config-2024-08-30');
```

#### `findFiles(rootPath: string, pattern: string): string[]`
패턴에 맞는 파일을 찾습니다.

```typescript
import { findFiles } from 'jnu-abc';

// 모든 TypeScript 파일 찾기
const tsFiles = findFiles('./src', '*.ts');

// 설정 파일 찾기
const configFiles = findFiles('./', '*.config.*');

// 모든 JSON 파일을 재귀적으로 찾기
const jsonFiles = findFiles('./', '**/*.json');
```

#### `findFolders(rootPath: string): string[]`
경로의 모든 디렉토리를 찾습니다.

```typescript
import { findFolders } from 'jnu-abc';

const srcFolders = findFolders('./src');
const allDirs = findFolders('./');
```

### 파일 유틸리티

#### `existsFile(filePath: string): boolean`
파일이 존재하는지 확인합니다.

```typescript
import { existsFile } from 'jnu-abc';

if (existsFile('./config.json')) {
  // 설정 로드
  const config = loadJson('./config.json');
}
```

#### `existsFolder(dirPath: string): boolean`
디렉토리가 존재하는지 확인합니다.

```typescript
import { existsFolder } from 'jnu-abc';

if (!existsFolder('./output')) {
  makeDir('./output');
}
```

#### `substituteInFile(filePath: string, replacements: Record<string, string>): void`
파일의 플레이스홀더를 값으로 교체합니다.

```typescript
import { substituteInFile } from 'jnu-abc';

// 템플릿 파일 내용: "안녕하세요 {{name}}님, 나이는 {{age}}세입니다"
const replacements = {
  '{{name}}': 'John',
  '{{age}}': '30'
};

substituteInFile('./templates/greeting.txt', replacements);
// 결과: "안녕하세요 John님, 나이는 30세입니다"
```

---

## 📅 날짜 및 시간 유틸리티

#### `today(): string`
YYYY-MM-DD 형식으로 현재 날짜를 가져옵니다.

```typescript
import { today } from 'jnu-abc';

const currentDate = today();
// 결과: "2025-08-30"

// 파일 이름에 사용
const logFileName = `app-${today()}.log`;
```

#### `now(): string`
ISO 형식으로 현재 날짜와 시간을 가져옵니다.

```typescript
import { now } from 'jnu-abc';

const timestamp = now();
// 결과: "2025-08-30T14:30:00.123Z"

// 로깅에 사용
console.log(`[${now()}] 애플리케이션 시작됨`);
```

#### `dateKo(): string`
한국어 형식으로 현재 날짜를 가져옵니다.

```typescript
import { dateKo } from 'jnu-abc';

const koreanDate = dateKo();
// 결과: "2025년 8월 30일"
```

#### `sleep(ms: number): void`
동기적 지연 (스레드 블로킹).

```typescript
import { sleep } from 'jnu-abc';

console.log('처리 시작...');
sleep(2000); // 2초 대기
console.log('처리 완료');
```

#### `sleepAsync(ms: number): Promise<void>`
비동기적 지연 (논블로킹).

```typescript
import { sleepAsync } from 'jnu-abc';

async function processData() {
  console.log('배치 1 처리 중...');
  await sleepAsync(1000);
  
  console.log('배치 2 처리 중...');
  await sleepAsync(1000);
  
  console.log('모두 완료!');
}
```

---

## 🖥️ 플랫폼 유틸리티

#### `PLATFORM: 'win' | 'mac' | 'linux'`
현재 플랫폼 감지.

```typescript
import { PLATFORM } from 'jnu-abc';

switch (PLATFORM) {
  case 'win':
    console.log('Windows에서 실행 중');
    break;
  case 'mac':
    console.log('macOS에서 실행 중');
    break;
  case 'linux':
    console.log('Linux에서 실행 중');
    break;
}
```

#### `composeHangul(text: string): string`
한글 문자를 조합합니다.

```typescript
import { composeHangul } from 'jnu-abc';

const composed = composeHangul('ㅎㅏㄴㄱㅡㄹ');
// 결과: "한글"
```

---

## 📝 타입 정의

### 핵심 타입
```typescript
// 일반적인 딕셔너리 타입
export type Dict = Record<string, any>;

// 파일 작업 옵션
export interface FileOptions {
  encoding?: BufferEncoding;
  overwrite?: boolean;
  newFile?: boolean;
}

// JSON 저장 옵션
export interface JsonOptions extends FileOptions {
  indent?: number;
  replacer?: (key: string, value: any) => any;
}
```

### 타입과 함께 사용
```typescript
import type { Dict, FileOptions } from 'jnu-abc';

// 강력한 타입의 데이터 처리
function processUserData(users: Dict[]): Dict[] {
  return users.map(user => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    age: parseInt(user.age)
  }));
}

// 타입이 지정된 파일 작업
const fileOptions: FileOptions = {
  encoding: 'utf8',
  overwrite: true
};
```

---

## 🍰 예제 및 레시피

### 레시피 1: CSV 데이터 처리
```typescript
import { loadFile, rowsFromCsv, dictsFromRows, arrFromDicts, saveJson } from 'jnu-abc';

// CSV 파일 로드 및 처리
const csvContent = loadFile('./data/users.csv');
const rows = rowsFromCsv(csvContent);
const headers = rows[0];
const dataRows = rows.slice(1);

// 객체로 변환
const users = dictsFromRows(headers, dataRows);

// 특정 데이터 추출
const emails = arrFromDicts(users, 'email');
const activeUsers = users.filter(user => user.status === 'active');

// 처리된 데이터 저장
saveJson('./output/processed-users.json', {
  users: activeUsers,
  emails: emails,
  total: users.length,
  active: activeUsers.length
});
```

### 레시피 2: 설정 관리
```typescript
import { loadJson, saveJson, loadEnv, overwriteKeys, existsFile } from 'jnu-abc';

// 기본 설정 로드
const baseConfig = loadJson('./config/default.json');

// 환경별 오버라이드 로드
const envOverrides = existsFile('./config/production.json') 
  ? loadJson('./config/production.json') 
  : {};

// 환경 변수 로드
const envVars = loadEnv('./.env');

// 설정 병합
const finalConfig = overwriteKeys(
  overwriteKeys(baseConfig, envOverrides),
  { 
    database: { url: envVars.DATABASE_URL },
    api: { key: envVars.API_KEY }
  }
);

// 병합된 설정 저장
saveJson('./runtime-config.json', finalConfig);
```

### 레시피 3: 파일 처리 파이프라인
```typescript
import { 
  findFiles, loadFile, substituteInFile, 
  makeDir, saveFile, today 
} from 'jnu-abc';

// 모든 템플릿 파일 찾기
const templates = findFiles('./templates', '*.template');

// 각 템플릿 처리
for (const template of templates) {
  // 템플릿 내용 로드
  const content = loadFile(template);
  
  // 교체할 내용 준비
  const replacements = {
    '{{date}}': today(),
    '{{version}}': '1.0.0',
    '{{author}}': 'JnJ 개발팀'
  };
  
  // 출력 디렉토리 생성
  makeDir('./output');
  
  // 최종 파일 생성
  const outputPath = template.replace('.template', '').replace('templates/', 'output/');
  saveFile(outputPath, content);
  substituteInFile(outputPath, replacements);
}
```

### 레시피 4: 데이터 변환 파이프라인
```typescript
import { 
  loadJson, dictsFromRows, arrFromDicts, 
  overwriteKeys, saveJson 
} from 'jnu-abc';

// 원시 데이터 로드
const rawData = loadJson<any[]>('./data/raw-users.json');

// 데이터 구조 변환
const transformedUsers = rawData.map(user => ({
  id: user.user_id,
  name: `${user.first_name} ${user.last_name}`,
  email: user.email_address,
  status: user.is_active ? 'active' : 'inactive',
  createdAt: new Date(user.created_timestamp).toISOString()
}));

// 상태별 그룹화
const activeUsers = transformedUsers.filter(u => u.status === 'active');
const inactiveUsers = transformedUsers.filter(u => u.status === 'inactive');

// 요약 생성
const summary = {
  total: transformedUsers.length,
  active: activeUsers.length,
  inactive: inactiveUsers.length,
  emails: arrFromDicts(activeUsers, 'email')
};

// 결과 저장
saveJson('./output/users.json', transformedUsers);
saveJson('./output/active-users.json', activeUsers);
saveJson('./output/summary.json', summary);
```

---

## 🔍 코드 테스트

```typescript
import { loadJson, saveJson, existsFile } from 'jnu-abc';

// 파일 작업 테스트
function testFileOperations() {
  const testData = { name: 'test', value: 123 };
  const testPath = './test-output.json';
  
  // 테스트 데이터 저장
  saveJson(testPath, testData);
  
  // 파일 존재 확인
  if (!existsFile(testPath)) {
    throw new Error('파일이 생성되지 않았습니다');
  }
  
  // 데이터 로드 및 확인
  const loadedData = loadJson(testPath);
  if (loadedData.name !== testData.name) {
    throw new Error('데이터 불일치');
  }
  
  console.log('✅ 모든 테스트 통과');
}
```

---

*최종 업데이트: 2025-08-30*  
*버전: 1.0*