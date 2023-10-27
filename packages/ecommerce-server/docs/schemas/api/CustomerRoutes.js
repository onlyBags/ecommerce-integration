export const DGLResponse_Shipping = {
  data: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/Shipping',
    },
  },
  status: 0,
  message: 'string',
};

export const DGLResponse_Billing = {
  data: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/`Shipping`',
    },
  },
  status: 0,
  message: 'string',
};
