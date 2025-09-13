# Technical Requirements Document (TRD)
## JNU-ABC: TypeScript Utility Library

### 1. System Architecture

#### 1.1 Library Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Public API    │    │   Core Modules   │    │   Native APIs   │
│   (index.ts)    │ ── │   (basic.ts,     │ ── │   (fs, path,    │
│                 │    │    builtin.ts)   │    │    child_process)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Type Exports   │    │  Function Groups │    │  Platform Utils │
│  (types.ts)     │    │  (data, file,    │    │  (Windows,      │
│                 │    │   time, platform)│    │   macOS, Linux) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### 1.2 Module Structure
- **basic.ts**: Data manipulation and utility functions
- **builtin.ts**: File system and platform operations  
- **types.ts**: TypeScript type definitions
- **index.ts**: Public API exports and documentation

### 2. Technical Specifications

#### 2.1 Programming Environment
- **Language**: TypeScript 4.9+ (strict mode)
- **Runtime**: Node.js 16+ (with v8 optimizations)
- **Build System**: SWC (Speedy Web Compiler)
- **Module Formats**: Dual ESM + CommonJS
- **Package Manager**: NPM with exact version locking

#### 2.2 Build Pipeline
```typescript
// Multi-target Build Process
TypeScript Source → Type Generation → SWC Compilation → Dual Output
    src/*.ts     →    types/*.d.ts  →     cjs/*.js    → NPM Package
                                   →     esm/*.js    → Distribution
```

#### 2.3 Export Strategy
```typescript
// Public API Surface
export { /* Data Utils */ } from './basic.js';
export { /* File Utils */ } from './builtin.js';

// Type-only exports
export type { Dict, FileOptions, PathOptions } from './types.js';
```

### 3. Core Components

#### 3.1 Data Manipulation Module (`basic.ts`)

**Object Operations**:
```typescript
// Core object manipulation functions
popDict<T>(dict: T, keys: string[]): Partial<T>
renameKeys<T>(dict: T, keyMap: Record<string, string>): T
overwriteKeys<T>(target: T, source: Partial<T>): T
updateKeys<T>(dict: T, updates: Partial<T>): T
swapDict<T>(dict: Record<string, T>): Record<T, string>
```

**Array Transformations**:
```typescript
// Array and data structure conversions
arrFromDicts<T>(dicts: T[], key: keyof T): Array<T[keyof T]>
dictsFromArrs(keys: string[], arrs: any[][]): any[]
rowsFromDicts<T>(dicts: T[]): any[][]
dictsFromRows(headers: string[], rows: any[][]): any[]
```

**CSV Processing**:
```typescript
// CSV data handling
rowsFromCsv(csvString: string, delimiter?: string): string[][]
csvFromRows(rows: any[][], delimiter?: string): string
```

#### 3.2 File System Module (`builtin.ts`)

**File Operations**:
```typescript
// Cross-platform file handling
loadFile(filePath: string): string
saveFile(filePath: string, content: string, options?: FileOptions): void
loadJson<T>(filePath: string): T
saveJson<T>(filePath: string, data: T, options?: JsonOptions): void
loadEnv(filePath: string): Record<string, string>
saveEnv(filePath: string, env: Record<string, string>): void
```

**Directory Operations**:
```typescript
// Directory management
makeDir(dirPath: string): void
copyDir(srcPath: string, destPath: string): void
findFiles(rootPath: string, pattern: string): string[]
findFolders(rootPath: string): string[]
existsFile(filePath: string): boolean
existsFolder(dirPath: string): boolean
```

**Advanced File Operations**:
```typescript
// Batch and advanced operations
moveFiles(files: string[], destDir: string): void
renameFilesInFolder(folderPath: string, renameMap: Record<string, string>): void
deleteFilesInFolder(folderPath: string, pattern: string): void
substituteInFile(filePath: string, replacements: Record<string, string>): void
```

#### 3.3 Platform Utilities

**Platform Detection**:
```typescript
// Cross-platform support
const PLATFORM: 'win' | 'mac' | 'linux' = detectPlatform()
```

**Korean Text Processing**:
```typescript
// Hangul text operations
composeHangul(text: string): string
```

**Date/Time Utilities**:
```typescript
// Date and time functions
today(): string
dateKo(): string  
now(): string
timeFromTimestamp(timestamp: number): string
sleep(ms: number): void
sleepAsync(ms: number): Promise<void>
```

### 4. Performance Architecture

#### 4.1 Optimization Strategies
- **Pure Functions**: Immutable operations where possible
- **Lazy Loading**: Dynamic imports for heavy operations
- **Memory Management**: Efficient garbage collection patterns
- **Streaming**: Large file operations with streams

#### 4.2 Performance Targets
```typescript
// Performance Benchmarks
Small Operations (<1KB):    <1ms
Medium Operations (<100KB): <50ms  
Large Operations (<10MB):   <1000ms
File System Operations:     <100ms (SSD), <500ms (HDD)
```

#### 4.3 Memory Management
- **Heap Usage**: <50MB for typical operations
- **Large Data**: Streaming for files >100MB
- **Garbage Collection**: Minimize object creation
- **Buffer Management**: Reuse buffers where possible

### 5. Data Type System

#### 5.1 Core Type Definitions
```typescript
// Basic types
export type Dict = Record<string, any>
export type Rows = any[][]
export type KeyValuePair<T = any> = [string, T]

// File operation types
export interface FileOptions {
  encoding?: BufferEncoding
  overwrite?: boolean
  newFile?: boolean
}

export interface JsonOptions extends FileOptions {
  indent?: number
  replacer?: (key: string, value: any) => any
}
```

#### 5.2 Function Signature Patterns
```typescript
// Consistent parameter patterns
function processData<T>(
  input: T,
  options?: ProcessOptions
): ProcessResult<T>

// Error-first callbacks where needed
type ErrorCallback<T> = (error: Error | null, result?: T) => void
```

### 6. Error Handling Architecture

#### 6.1 Error Categories
```typescript
// Error classification
enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  FILE_SYSTEM = 'FILE_SYSTEM_ERROR', 
  PERMISSION = 'PERMISSION_ERROR',
  PLATFORM = 'PLATFORM_ERROR',
  DATA_FORMAT = 'DATA_FORMAT_ERROR'
}
```

#### 6.2 Error Handling Strategy
- **Fail Fast**: Validate inputs early
- **Graceful Degradation**: Fallback mechanisms
- **Detailed Messages**: Clear error descriptions
- **Error Recovery**: Retry logic where appropriate

#### 6.3 Exception Safety
```typescript
// Exception safety guarantees
Strong Exception Safety:  // Function either succeeds or state unchanged
- File operations with atomic writes
- Data transformations with validation

Basic Exception Safety:   // Function may change state but remains valid  
- Large data processing
- Directory operations
```

### 7. Testing Architecture

#### 7.1 Testing Strategy
```typescript
// Test Coverage Goals
Unit Tests:        95% function coverage
Integration Tests: 80% cross-module scenarios
Platform Tests:    100% platform-specific code
Performance Tests: All heavy operations
```

#### 7.2 Testing Framework
- **Runner**: Jest 29.x with TypeScript support
- **Mocking**: Built-in Jest mocks for file system
- **Fixtures**: Dedicated test data sets
- **Benchmarks**: Performance regression testing

#### 7.3 Test Categories
```typescript
// Test organization
describe('Data Operations', () => {
  // Pure function tests - no side effects
  test('Object manipulation functions')
  test('Array transformation functions')
  test('CSV processing functions')
})

describe('File Operations', () => {
  // Side effect tests - isolated environments
  test('File I/O operations')
  test('Directory operations')  
  test('Cross-platform compatibility')
})
```

### 8. Security Requirements

#### 8.1 Input Validation
- **Path Sanitization**: Prevent path traversal attacks
- **Content Validation**: Check file content safety
- **Size Limits**: Prevent resource exhaustion
- **Type Validation**: Runtime type checking

#### 8.2 File System Security
```typescript
// Security measures
- Validate file paths before operations
- Check permissions before file access
- Sanitize file names and contents
- Prevent unauthorized directory access
```

### 9. Platform Compatibility

#### 9.1 Supported Platforms
- **Windows**: 10, 11 (x64, ARM64)
- **macOS**: 10.15+ (x64, Apple Silicon)
- **Linux**: Ubuntu 18.04+, CentOS 7+, Alpine Linux

#### 9.2 Platform-Specific Implementations
```typescript
// Platform abstraction
const platformOperations = {
  win: {
    pathSeparator: '\\',
    commandShell: 'cmd.exe',
    encoding: 'utf8'
  },
  mac: {
    pathSeparator: '/',
    commandShell: '/bin/sh', 
    encoding: 'utf8'
  },
  linux: {
    pathSeparator: '/',
    commandShell: '/bin/bash',
    encoding: 'utf8'
  }
}
```

### 10. Build & Distribution

#### 10.1 Build Configuration
```json
// SWC Configuration
{
  "jsc": {
    "target": "es2020",
    "parser": { "syntax": "typescript", "decorators": true },
    "transform": { "legacyDecorator": true },
    "externalHelpers": false
  },
  "module": { "type": "commonjs" | "es6" },
  "minify": false
}
```

#### 10.2 Distribution Strategy
- **NPM Package**: Optimized for download size
- **Tree Shaking**: ESM modules for optimal bundling
- **TypeScript Definitions**: Complete type information
- **Documentation**: Generated API docs

### 11. Monitoring & Maintenance

#### 11.1 Performance Monitoring
- **Benchmarking**: Automated performance testing
- **Memory Profiling**: Heap usage tracking
- **CPU Profiling**: Execution time analysis
- **File I/O Metrics**: Disk operation performance

#### 11.2 Quality Metrics
```typescript
// Quality indicators
Code Coverage:     95%+ (enforced)
Type Safety:       100% (strict TypeScript)
Documentation:     90%+ (JSDoc coverage)
Performance:       No regression (automated tests)
```

### 12. Future Technical Roadmap

#### 12.1 Next Version Features
- **Streaming Operations**: Large data processing
- **Worker Threads**: CPU-intensive parallel operations
- **WebAssembly**: Performance-critical functions
- **Advanced Types**: More precise TypeScript definitions

#### 12.2 Long-term Architecture
- **Plugin System**: Extensible utility framework
- **Configuration**: Runtime behavior customization  
- **Caching Layer**: Intelligent result caching
- **Remote Operations**: Network-based utilities

---
*Document Version: 1.0*  
*Last Updated: 2025-08-30*  
*Next Review: 2025-09-30*