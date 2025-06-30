/**
 * Options to configure the patch query builder.
 *
 * @property {string} tableName - The name of the table to update.
 * @property {string} [idColumn] - The column name for identifying the record. Defaults to "id".
 * @property {string[]} allowedFields - The list of fields allowed to be updated.
 * @property {(field: string, value: unknown) => Promise<unknown> | unknown} [transformFields] -
 * A function to transform or validates field values before inclusion in the query.
 *
 * @example
 * Example for transforming strings to lowercase:
 * ```
 * transformFields: async (field, value) => {
 *   if (field === "username" && typeof value === "string")
 *     return value.toLowerCase();
 *   return value;
 * },
 * ```
 *
 */
export type PatchQueryOptions = {
  tableName: string;
  idColumn?: string;
  allowedFields: string[];
  transformFields?: (
    field: string,
    value: unknown
  ) => Promise<unknown> | unknown;
};

/**
 * Result from buildPatchQuery
 *
 * @property {string} query - The resulting query with parameter injection.
 * @property {unknown[]} values - The parameters, in order of injection.
 */
export type PatchQueryResult = {
  query: string;
  values: unknown[];
};

/**
 * Function for building a patch query.
 *
 * Creates a query using allowed fields, representing columns in the database, and field-value pairs.
 * @param {string} id - Required to identify the record in the database.
 * @param {Record<string, unknown>} updates - The field-value pairs, null values are omitted from the resulting query.
 * @param {PatchQueryOptions} options - Options to configure the patch query builder.
 * @returns {Promise<PatchQueryResult | null>} A promise resolving to the generated query and parameter values, or null if no valid updates were provided.
 *
 */
export const buildPatchQuery = async (
  id: string,
  updates: Record<string, unknown>,
  options: PatchQueryOptions
): Promise<PatchQueryResult | null> => {
  const idColumn = options.idColumn ?? "id";
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  for (const field of options.allowedFields) {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      let value = updates[field];

      if (value !== undefined) {
        if (options.transformFields) {
          value = await options.transformFields(field, value);
        }

        fields.push(`${field} = $${paramIndex++}`);
        values.push(value);
      }
    }
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const query = `UPDATE ${options.tableName} SET ${fields.join(
    ", "
  )} WHERE ${idColumn} = $${paramIndex} RETURNING *;`;

  return { query, values };
};
