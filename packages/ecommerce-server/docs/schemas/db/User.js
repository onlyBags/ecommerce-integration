export const User = {
  $id: 'string',
  $username: 'string',
  $apiKey: 'string',
  $datasource: {
    $ref: '#/components/schemas/Datasource',
  },
  $isActive: 'boolean',
  $createdAt: {
    type: 'string',
    format: 'date-time', // Date format in OpenAPI v3 for date-time values
  },
  $updatedAt: {
    type: 'string',
    format: 'date-time', // Date format in OpenAPI v3 for date-time values
  },
};
