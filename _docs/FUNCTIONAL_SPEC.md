# Functional Specification
## JNU-ABC: TypeScript Utility Library

### 📋 Document Information
- **Document Type**: Functional Specification
- **Version**: 1.0
- **Last Updated**: 2025-08-30
- **Target Audience**: Developers, Library Users, QA Engineers

---

## 1. Overview & Scope

### 1.1 Library Purpose
JNU-ABC provides a comprehensive collection of utility functions for TypeScript/JavaScript applications, focusing on data manipulation, file operations, and platform-specific functionality. It serves as a foundational library to reduce code duplication and accelerate development across JnJ projects.

### 1.2 Core Functional Areas
- **Data Transformation**: Object and array manipulation utilities
- **File System Operations**: Cross-platform file I/O and directory management
- **CSV Processing**: Bidirectional CSV ↔ JSON ↔ Array conversions
- **Date/Time Utilities**: Formatting and manipulation functions
- **Platform Utilities**: Cross-platform compatibility functions

### 1.3 Design Principles
- **Pure Functions**: Immutable operations without side effects where possible
- **Type Safety**: Complete TypeScript definitions with strict typing
- **Cross-Platform**: Consistent behavior across Windows, macOS, and Linux
- **Performance**: Optimized for common use cases with minimal overhead

---

## 2. Data Manipulation Functions

### 2.1 Object Manipulation Category

#### 2.1.1 Function: `popDict<T>(dict: T, keys: string[]): Partial<T>`
**Purpose**: Remove specified keys from an object, returning a new object without those keys.

**Input Specifications**:
- `dict: T` - Source object of any type
- `keys: string[]` - Array of key names to remove

**Output Specifications**:
- Returns `Partial<T>` - New object with specified keys removed
- Original object remains unchanged (immutable operation)

**Behavior**:
```typescript
// Input: { name: 'John', age: 30, password: 'secret' }, ['password']
// Output: { name: 'John', age: 30 }
```

**Error Handling**:
- Non-existent keys are silently ignored
- Empty key array returns shallow copy of original object
- Null/undefined input returns empty object

#### 2.1.2 Function: `renameKeys<T>(dict: T, keyMap: Record<string, string>): T`
**Purpose**: Create new object with renamed keys according to provided mapping.

**Input Specifications**:
- `dict: T` - Source object to rename keys
- `keyMap: Record<string, string>` - Mapping of old keys to new keys

**Output Specifications**:
- Returns `T` - New object with renamed keys
- Values remain unchanged, only key names are modified

**Behavior**:
```typescript
// Input: { firstName: 'John' }, { firstName: 'first_name' }
// Output: { first_name: 'John' }
```

**Error Handling**:
- Keys not in mapping remain unchanged
- Conflicting key mappings: last mapping wins
- Circular mappings are resolved with warning

#### 2.1.3 Function: `overwriteKeys<T>(target: T, source: Partial<T>): T`
**Purpose**: Merge two objects with source properties overwriting target properties.

**Input Specifications**:
- `target: T` - Base object to merge into
- `source: Partial<T>` - Object with overriding values

**Output Specifications**:
- Returns `T` - New merged object
- Deep merge for nested objects
- Array values are replaced, not merged

**Behavior**:
```typescript
// Input: { a: 1, b: 2 }, { b: 3, c: 4 }
// Output: { a: 1, b: 3, c: 4 }
```

### 2.2 Array Transformation Category

#### 2.2.1 Function: `arrFromDicts<T>(dicts: T[], key: keyof T): Array<T[keyof T]>`
**Purpose**: Extract values for a specific key from an array of objects.

**Input Specifications**:
- `dicts: T[]` - Array of objects to extract from
- `key: keyof T` - Key name to extract values for

**Output Specifications**:
- Returns `Array<T[keyof T]>` - Array of extracted values
- Maintains original array order
- Includes undefined values if key doesn't exist in some objects

**Behavior**:
```typescript
// Input: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }], 'name'
// Output: ['John', 'Jane']
```

#### 2.2.2 Function: `dictsFromRows(headers: string[], rows: any[][]): any[]`
**Purpose**: Convert 2D array with header row into array of objects.

**Input Specifications**:
- `headers: string[]` - Array of column names
- `rows: any[][]` - 2D array of data values

**Output Specifications**:
- Returns `any[]` - Array of objects with headers as keys
- Each row becomes an object with header keys mapped to row values
- Missing values default to undefined

**Behavior**:
```typescript
// Input: ['name', 'age'], [['John', 30], ['Jane', 25]]
// Output: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]
```

#### 2.2.3 Function: `rowsFromDicts<T>(dicts: T[]): any[][]`
**Purpose**: Convert array of objects into 2D array format.

**Input Specifications**:
- `dicts: T[]` - Array of objects to convert

**Output Specifications**:
- Returns `any[][]` - 2D array with consistent column ordering
- First row contains object keys (headers)
- Subsequent rows contain corresponding values
- Missing properties become undefined in output

**Behavior**:
```typescript
// Input: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]
// Output: [['name', 'age'], ['John', 30], ['Jane', 25]]
```

### 2.3 CSV Processing Category

#### 2.3.1 Function: `rowsFromCsv(csvString: string, delimiter?: string): string[][]`
**Purpose**: Parse CSV string into 2D array structure.

**Input Specifications**:
- `csvString: string` - Raw CSV data as string
- `delimiter?: string` - Field separator (default: ',')

**Output Specifications**:
- Returns `string[][]` - 2D array of parsed values
- All values returned as strings (no automatic type conversion)
- Handles quoted fields with embedded delimiters and newlines

**Parsing Rules**:
- Fields may be enclosed in double quotes
- Quoted fields can contain delimiters and newlines
- Double quotes within quoted fields are escaped as ""
- Empty lines are preserved as empty arrays

**Behavior**:
```typescript
// Input: "name,age\nJohn,30\nJane,25"
// Output: [['name', 'age'], ['John', '30'], ['Jane', '25']]
```

#### 2.3.2 Function: `csvFromRows(rows: any[][], delimiter?: string): string`
**Purpose**: Convert 2D array into CSV string format.

**Input Specifications**:
- `rows: any[][]` - 2D array of values to convert
- `delimiter?: string` - Field separator (default: ',')

**Output Specifications**:
- Returns `string` - Properly formatted CSV string
- Automatically quotes fields containing delimiters, quotes, or newlines
- Converts all values to strings using toString()

**Formatting Rules**:
- Values containing delimiter, quotes, or newlines are automatically quoted
- Null/undefined values become empty strings
- Boolean values become "true"/"false"
- Numbers are converted to string representation

---

## 3. File System Operations

### 3.1 JSON File Operations

#### 3.1.1 Function: `loadJson<T>(filePath: string): T`
**Purpose**: Load and parse JSON file with type safety.

**Input Specifications**:
- `filePath: string` - Absolute or relative path to JSON file

**Output Specifications**:
- Returns `T` - Parsed JSON object cast to specified type
- Throws on invalid JSON syntax
- Throws on file not found or permission errors

**File Handling**:
- Supports UTF-8 encoding
- Validates JSON syntax before parsing
- Provides detailed error messages for parsing failures

#### 3.1.2 Function: `saveJson<T>(filePath: string, data: T, options?: JsonOptions): void`
**Purpose**: Serialize and save object as JSON file.

**Input Specifications**:
- `filePath: string` - Target file path
- `data: T` - Object to serialize
- `options?: JsonOptions` - Formatting and encoding options

**JsonOptions Interface**:
```typescript
interface JsonOptions extends FileOptions {
  indent?: number;              // Indentation spaces (default: 2)
  replacer?: (key: string, value: any) => any;  // JSON.stringify replacer
}
```

**Behavior**:
- Creates parent directories if they don't exist
- Overwrites existing files by default
- Supports custom JSON serialization with replacer function

### 3.2 Generic File Operations

#### 3.2.1 Function: `loadFile(filePath: string): string`
**Purpose**: Read file contents as UTF-8 string.

**Input Specifications**:
- `filePath: string` - Path to text file

**Output Specifications**:
- Returns `string` - Complete file contents
- Throws on file not found or permission errors
- Handles various text encodings with UTF-8 default

#### 3.2.2 Function: `saveFile(filePath: string, content: string, options?: FileOptions): void`
**Purpose**: Write string content to file with options.

**FileOptions Interface**:
```typescript
interface FileOptions {
  encoding?: BufferEncoding;    // Text encoding (default: 'utf8')
  overwrite?: boolean;          // Allow overwriting (default: true)
  newFile?: boolean;            // Require new file creation (default: false)
}
```

**Behavior**:
- Creates parent directories automatically
- Respects overwrite protection settings
- Supports multiple text encodings

### 3.3 Environment File Operations

#### 3.3.1 Function: `loadEnv(filePath: string): Record<string, string>`
**Purpose**: Parse .env file into key-value object.

**Input Specifications**:
- `filePath: string` - Path to .env file

**Output Specifications**:
- Returns `Record<string, string>` - Environment variables as object
- Supports standard .env file format
- Handles quoted values and comments

**Parsing Rules**:
- Lines starting with # are treated as comments
- KEY=value format required
- Values can be quoted with single or double quotes
- Empty lines are ignored
- Duplicate keys: later values overwrite earlier ones

#### 3.3.2 Function: `saveEnv(filePath: string, env: Record<string, string>): void`
**Purpose**: Write environment variables to .env file.

**Input Specifications**:
- `filePath: string` - Target .env file path
- `env: Record<string, string>` - Environment variables object

**Output Format**:
- KEY=value format, one per line
- Values containing spaces are automatically quoted
- Maintains consistent formatting
- Adds timestamp comment at file beginning

### 3.4 Directory Management

#### 3.4.1 Function: `makeDir(dirPath: string): void`
**Purpose**: Create directory recursively with parent directories.

**Input Specifications**:
- `dirPath: string` - Directory path to create

**Behavior**:
- Creates all parent directories as needed
- Succeeds silently if directory already exists
- Sets appropriate permissions (755 on Unix systems)
- Handles both relative and absolute paths

#### 3.4.2 Function: `findFiles(rootPath: string, pattern: string): string[]`
**Purpose**: Find files matching glob pattern recursively.

**Input Specifications**:
- `rootPath: string` - Starting directory for search
- `pattern: string` - Glob pattern (*, **, ?, [...])

**Output Specifications**:
- Returns `string[]` - Array of matching file paths
- Paths are relative to rootPath
- Results are sorted alphabetically
- Follows symbolic links by default

**Pattern Support**:
- `*` - Matches any characters within single directory level
- `**` - Matches directories recursively
- `?` - Matches single character
- `[abc]` - Matches any character in brackets
- `{a,b}` - Matches either pattern a or b

---

## 4. Date & Time Utilities

### 4.1 Date Formatting Functions

#### 4.1.1 Function: `today(): string`
**Purpose**: Get current date in standardized YYYY-MM-DD format.

**Output Specifications**:
- Returns `string` - Date in ISO 8601 date format
- Uses local timezone
- Zero-padded month and day values

#### 4.1.2 Function: `now(): string`
**Purpose**: Get current timestamp in ISO 8601 format.

**Output Specifications**:
- Returns `string` - Complete timestamp with timezone
- Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
- UTC timezone by default

#### 4.1.3 Function: `dateKo(): string`
**Purpose**: Format current date in Korean locale.

**Output Specifications**:
- Returns `string` - Korean formatted date
- Format: "YYYY년 M월 D일"
- Uses Korean number characters

### 4.2 Timing Functions

#### 4.2.1 Function: `sleep(ms: number): void`
**Purpose**: Synchronous delay that blocks thread execution.

**Input Specifications**:
- `ms: number` - Milliseconds to sleep

**Behavior**:
- Blocks execution thread for specified duration
- Uses busy-wait implementation
- Not recommended for production use (blocks event loop)

#### 4.2.2 Function: `sleepAsync(ms: number): Promise<void>`
**Purpose**: Asynchronous delay using promises.

**Input Specifications**:
- `ms: number` - Milliseconds to wait

**Output Specifications**:
- Returns `Promise<void>` - Resolves after delay
- Non-blocking (allows other operations to continue)
- Uses setTimeout internally

---

## 5. Platform Utilities

### 5.1 Platform Detection

#### 5.1.1 Constant: `PLATFORM: 'win' | 'mac' | 'linux'`
**Purpose**: Detect current operating system platform.

**Detection Logic**:
- `'win'` - Windows operating systems (process.platform === 'win32')
- `'mac'` - macOS operating systems (process.platform === 'darwin')
- `'linux'` - Linux and Unix systems (all others)

**Usage**:
- Enable platform-specific code paths
- Conditional file path handling
- Platform-appropriate command execution

### 5.2 Text Processing

#### 5.2.1 Function: `composeHangul(text: string): string`
**Purpose**: Compose Korean Hangul characters from component parts.

**Input Specifications**:
- `text: string` - Korean text with decomposed characters

**Output Specifications**:
- Returns `string` - Composed Korean text
- Converts Jamo characters to complete Hangul syllables
- Non-Korean characters pass through unchanged

---

## 6. Error Handling Specifications

### 6.1 File Operation Errors
- **FileNotFound**: Throws with descriptive path information
- **PermissionDenied**: Includes suggested resolution steps
- **InvalidPath**: Validates path format and existence
- **DiskSpaceError**: Provides available space information

### 6.2 Data Processing Errors
- **TypeValidation**: Validates input types at runtime
- **FormatErrors**: Provides specific format requirements
- **ConversionErrors**: Details failed conversion attempts
- **MemoryErrors**: Handles large dataset processing failures

### 6.3 Cross-Platform Errors
- **PlatformUnsupported**: Graceful degradation for unsupported features
- **EncodingErrors**: Character encoding conversion failures
- **PathSeparator**: Automatic path separator normalization

---

## 7. Performance Specifications

### 7.1 Execution Time Requirements
- **Simple Operations**: <1ms for basic data transformations
- **File I/O**: <100ms for files <1MB, <1s for files <100MB
- **CSV Processing**: <500ms for files <10MB
- **Directory Operations**: <200ms for <1000 files

### 7.2 Memory Usage Guidelines
- **Data Processing**: Linear memory usage relative to input size
- **File Operations**: Streaming for files >10MB
- **Object Operations**: Immutable operations create new objects
- **Garbage Collection**: Minimal object retention after operations

### 7.3 Scalability Considerations
- **Large Datasets**: Automatic batching for operations >1000 items
- **Memory Pressure**: Streaming fallbacks for memory-constrained environments
- **Concurrent Operations**: Thread-safe for read operations
- **Performance Monitoring**: Optional performance metrics collection

---

*Document Version: 1.0*  
*Last Updated: 2025-08-30*  
*Next Review: 2025-09-30*