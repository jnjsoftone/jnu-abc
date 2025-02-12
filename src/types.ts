// & Types AREA
// &---------------------------------------------------------------------------

/**
 * @module basic
 */
export type Dict = Record<string, any>;

/**
 * @module builtin
 */
export type FileOptions = {
  encoding?: BufferEncoding;
  overwrite?: boolean;
  newFile?: boolean;
};

export type JsonOptions = {
  indent?: number;
  overwrite?: boolean;
  newFile?: boolean;
};