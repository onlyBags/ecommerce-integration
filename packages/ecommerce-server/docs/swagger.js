import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'DG-Live Ecommerce API',
    description: 'API documentation for the Ecommerce application',
  },
  host: 'localhost:8080',
  basePath: '/v1',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Customer',
      description: 'Endpoints related to customer operations',
    },
    {
      name: 'Dashboard',
      description: 'Endpoints related to dashboard operations',
    },
  ],
  securityDefinitions: {},
  definitions: {
    DGLResponse: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'The data payload',
        },
        status: {
          type: 'integer',
          description: 'HTTP status code',
        },
        message: {
          type: 'string',
          description: 'Response message',
        },
      },
    },
    SaveUserReq: {
      $username: 'john_doe',
      $apiKey: '1234567890abcdef',
      $masterKey: 'abcdef1234567890',
      description: 'Schema for saving a user request',
      properties: {
        username: {
          type: 'string',
          description: 'The username of the user.',
          example: 'john_doe',
        },
        apiKey: {
          type: 'string',
          description: 'The API key for the user.',
          example: '1234567890abcdef',
        },
        masterKey: {
          type: 'string',
          description: 'The master key for the user.',
          example: 'abcdef1234567890',
        },
      },
      required: ['username', 'apiKey', 'masterKey'],
    },
    NewSlotReq: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the slot',
          required: false,
        },
        enabled: {
          type: 'boolean',
          description: 'Whether the slot is enabled or not',
          required: false,
        },
        posX: {
          type: 'number',
          description: 'X position of the slot',
          required: false,
        },
        posY: {
          type: 'number',
          description: 'Y position of the slot',
          required: false,
        },
        posZ: {
          type: 'number',
          description: 'Z position of the slot',
          required: false,
        },
        sizeX: {
          type: 'number',
          description: 'X size of the slot',
          required: false,
        },
        sizeY: {
          type: 'number',
          description: 'Y size of the slot',
          required: false,
        },
        sizeZ: {
          type: 'number',
          description: 'Z size of the slot',
          required: false,
        },
        rotX: {
          type: 'number',
          description: 'X rotation of the slot',
          required: false,
        },
        rotY: {
          type: 'number',
          description: 'Y rotation of the slot',
          required: false,
        },
        rotZ: {
          type: 'number',
          description: 'Z rotation of the slot',
          required: false,
        },
      },
    },
    UpdateSlotReq: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the slot',
          required: false,
        },
        enabled: {
          type: 'boolean',
          description: 'Whether the slot is enabled or not',
          required: false,
        },
        posX: {
          type: 'number',
          description: 'X position of the slot',
          required: false,
        },
        posY: {
          type: 'number',
          description: 'Y position of the slot',
          required: false,
        },
        posZ: {
          type: 'number',
          description: 'Z position of the slot',
          required: false,
        },
        sizeX: {
          type: 'number',
          description: 'X size of the slot',
          required: false,
        },
        sizeY: {
          type: 'number',
          description: 'Y size of the slot',
          required: false,
        },
        sizeZ: {
          type: 'number',
          description: 'Z size of the slot',
          required: false,
        },
        rotX: {
          type: 'number',
          description: 'X rotation of the slot',
          required: false,
        },
        rotY: {
          type: 'number',
          description: 'Y rotation of the slot',
          required: false,
        },
        rotZ: {
          type: 'number',
          description: 'Z rotation of the slot',
          required: false,
        },
        productId: {
          type: 'number',
          description: 'ID of the product',
          required: false,
        },
      },
    },
    SaveUserDatasourceReq: {
      type: 'object',
      properties: {
        name: 'string',
        wallet: 'string',
        platform: {
          type: 'string',
          enum: ['woocommerce', 'magento'],
        },
        consumerKey: 'string',
        consumerSecret: 'string',
        accessToken: 'string',
        accessTokenSecret: 'string',
        baseUrl: 'string',
      },
    },
    Slot: {
      id: { type: 'number', description: 'Unique identifier for the slot' },
      name: { type: 'string', description: 'Name of the slot' },
      enabled: {
        type: 'boolean',
        description: 'Whether the slot is enabled or not',
      },
      posX: { type: 'number', description: 'X position of the slot' },
      posY: { type: 'number', description: 'Y position of the slot' },
      posZ: { type: 'number', description: 'Z position of the slot' },
      sizeX: { type: 'number', description: 'X size of the slot' },
      sizeY: { type: 'number', description: 'Y size of the slot' },
      sizeZ: { type: 'number', description: 'Z size of the slot' },
      rotX: { type: 'number', description: 'X rotation of the slot' },
      rotY: { type: 'number', description: 'Y rotation of the slot' },
      rotZ: { type: 'number', description: 'Z rotation of the slot' },
    },
    Datasource: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the datasource',
        },
        name: { type: 'string', description: 'Name of the datasource' },
        wallet: {
          type: 'string',
          description: 'Wallet associated with the datasource',
        },
        user: {
          $ref: '#/definitions/User',
          description: 'User associated with the datasource',
        }, // Assuming you have a User definition
        woocommerceProduct: {
          type: 'array',
          items: { $ref: '#/definitions/WoocommerceProduct' },
          description: 'Relation to WoocommerceProduct',
        },
        slot: {
          type: 'array',
          items: { $ref: '#/definitions/Slot' },
          description: 'Slots associated with the datasource',
        },
        platform: {
          type: 'string',
          enum: ['woocommerce', 'magento'],
          description: 'Platform type',
        },
        baseUrl: { type: 'string', description: 'Base URL for the datasource' },
        consumerKey: {
          type: 'string',
          description: 'Consumer key for API access',
        },
        consumerSecret: {
          type: 'string',
          description: 'Consumer secret for API access',
        },
        accessToken: {
          type: 'string',
          description: 'Access token for API access',
        },
        accessTokenSecret: {
          type: 'string',
          description: 'Access token secret for API access',
        },
        webhookSecret: {
          type: 'string',
          description: 'Webhook secret for API access',
        },
        isActive: {
          type: 'boolean',
          description: 'Whether the datasource is active or not',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation date',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update date',
        },
      },
      required: [
        'id',
        'name',
        'wallet',
        'user',
        'woocommerceProduct',
        'slot',
        'platform',
        'baseUrl',
        'consumerKey',
        'consumerSecret',
        'accessToken',
        'accessTokenSecret',
        'webhookSecret',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    },
    WoocommerceProduct: {
      id: 1,
      productId: 1,
      datasourceId: 1,
      name: 'Sample Product',
      slug: 'sample-product',
      permalink: 'http://example.com/product/sample-product',
      dateCreated: '2023-01-01T12:00:00',
      dateCreatedGmt: '2023-01-01T12:00:00',
      dateModified: '2023-01-01T12:00:00',
      dateModifiedGmt: '2023-01-01T12:00:00',
      type: 'simple',
      status: 'publish',
      featured: false,
      catalogVisibility: 'visible',
      description: 'Sample description',
      shortDescription: 'Short description',
      sku: 'SKU123',
      price: '10.00',
      regularPrice: '12.00',
      salePrice: '9.00',
      dateOnSaleFrom: '2023-01-01T12:00:00',
      dateOnSaleFromGmt: '2023-01-01T12:00:00',
      dateOnSaleTo: '2023-01-01T12:00:00',
      dateOnSaleToGmt: '2023-01-01T12:00:00',
      priceHtml: '<span>$10.00</span>',
      onSale: false,
      purchasable: true,
      totalSales: 10,
      virtual: false,
      downloadable: false,
      downloads: '',
      downloadLimit: 1,
      downloadExpiry: 1,
      externalUrl: 'http://example.com',
      buttonText: 'Buy Now',
      taxStatus: 'taxable',
      taxClass: '',
      manageStock: false,
      stockQuantity: '10',
      stockStatus: 'instock',
      backorders: 'no',
      backordersAllowed: false,
      backordered: false,
      soldIndividually: false,
      weight: '1.00',
      shippingRequired: true,
      shippingTaxable: true,
      shippingClass: '',
      shippingClassId: 1,
      reviewsAllowed: true,
      averageRating: '4.5',
      ratingCount: 100,
      relatedIds: '1,2,3',
      upsellIds: '4,5,6',
      crossSellIds: '7,8,9',
      parentId: 0,
      purchaseNote: 'Thank you for purchasing!',
      defaultAttributes: [],
      variations: '1,2,3',
      groupedProducts: '4,5,6',
      menuOrder: 1,
      jetpackPublicizeConnections: '',
      dimensions: {
        length: '10',
        width: '10',
        height: '10',
      },
      images: [
        {
          src: 'http://example.com/image.jpg',
          name: 'Sample Image',
          alt: 'Sample Alt Text',
        },
      ],
      categories: [
        {
          id: 1,
          name: 'Sample Category',
          slug: 'sample-category',
        },
      ],
      tags: [
        {
          id: 1,
          name: 'Sample Tag',
          slug: 'sample-tag',
        },
      ],
      attributes: [
        {
          id: 1,
          name: 'Color',
          position: 1,
          visible: true,
          variation: false,
          options: ['Red', 'Green'],
        },
      ],
      metaData: [
        {
          id: 1,
          key: '_sample_meta_key',
          value: '_sample_meta_value',
        },
      ],
      slot: [
        {
          id: 1,
          name: 'Sample Slot',
          position: 1,
        },
      ],
    },
    Order: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Unique identifier for the Order' },
        customer: {
          $ref: '#/definitions/Customer',
          description: 'Relation to Customer',
        },
        orderId: { type: 'number', description: 'Order ID' },
        status: { type: 'string', description: 'Order status' },
        currency: {
          type: 'string',
          default: 'USD',
          description: 'Order currency',
        },
        total: { type: 'number', description: 'Total amount of the order' },
        orderKey: { type: 'string', description: 'Order key' },
        iceValue: { type: 'number', default: 0, description: 'ICE value' },
        iceValueTimestamp: {
          type: 'string',
          format: 'date-time',
          description: 'Timestamp for ICE value',
        },
      },
      required: [
        'id',
        'customer',
        'orderId',
        'status',
        'currency',
        'total',
        'orderKey',
      ],
    },

    OrderLog: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the OrderLog',
        },
        transactionHash: { type: 'string', description: 'Transaction hash' },
        blockNumber: { type: 'number', description: 'Block number' },
        orderStatus: { type: 'string', description: 'Order status' },
        customer: {
          $ref: '#/definitions/Customer',
          description: 'Relation to Customer',
        },
        user: { $ref: '#/definitions/User', description: 'Relation to User' },
        tokenId: { type: 'string', description: 'Token ID' },
        amount: { type: 'string', nullable: true, description: 'Amount' },
        isValidated: {
          type: 'boolean',
          default: false,
          description: 'Is validated',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation date',
        },
      },
      required: [
        'id',
        'transactionHash',
        'blockNumber',
        'orderStatus',
        'customer',
        'user',
        'tokenId',
      ],
    },
    User: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Unique identifier for the User' },
        username: { type: 'string', description: 'Username of the User' },
        apiKey: {
          type: 'string',
          description: 'API key associated with the User',
        },
        datasource: {
          type: 'array',
          items: { $ref: '#/definitions/Datasource' },
          description: 'Relation to Datasource',
        },
        isActive: {
          type: 'boolean',
          description: 'Whether the User is active or not',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date when the User was created',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date when the User was last updated',
        },
      },
      required: [
        'id',
        'username',
        'apiKey',
        'datasource',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    },
    Links: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Unique identifier for the Links' },
        self: {
          type: 'array',
          items: { $ref: '#/definitions/Self' },
          nullable: true,
          description: 'Relation to Self',
        },
        collection: {
          type: 'array',
          items: { $ref: '#/definitions/Collection' },
          nullable: true,
          description: 'Relation to Collection',
        },
      },
      required: ['id'],
    },
    Dimensions: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the Dimensions',
        },
        length: { type: 'string', description: 'Length of the product' },
        width: { type: 'string', description: 'Width of the product' },
        height: { type: 'string', description: 'Height of the product' },
        woocommerceProduct: {
          $ref: '#/definitions/WoocommerceProduct',
          description: 'Relation to WoocommerceProduct',
        },
      },
      required: ['id', 'length', 'width', 'height', 'woocommerceProduct'],
    },
    Image: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Unique identifier for the Image' },
        imageId: { type: 'number', description: 'Image ID' },
        dateCreated: {
          type: 'string',
          description: 'Date when the image was created',
        },
        dateCreatedGmt: {
          type: 'string',
          description: 'Date when the image was created in GMT',
        },
        dateModified: {
          type: 'string',
          description: 'Date when the image was modified',
        },
        dateModifiedGmt: {
          type: 'string',
          description: 'Date when the image was modified in GMT',
        },
        src: { type: 'string', description: 'Source URL of the image' },
        name: { type: 'string', description: 'Name of the image' },
        alt: { type: 'string', description: 'Alt text for the image' },
        woocommerceProduct: {
          $ref: '#/definitions/WoocommerceProduct',
          description: 'Relation to WoocommerceProduct',
        },
      },
      required: [
        'id',
        'imageId',
        'dateCreated',
        'dateCreatedGmt',
        'dateModified',
        'dateModifiedGmt',
        'src',
        'name',
        'alt',
        'woocommerceProduct',
      ],
    },

    Category: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the Category',
        },
        categoryId: { type: 'number', description: 'Category ID' },
        name: { type: 'string', description: 'Name of the category' },
        slug: { type: 'string', description: 'Slug of the category' },
        woocommerceProduct: {
          $ref: '#/definitions/WoocommerceProduct',
          description: 'Relation to WoocommerceProduct',
        },
      },
      required: ['id', 'categoryId', 'name', 'slug', 'woocommerceProduct'],
    },
    Collection: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the Collection',
        },
        href: {
          type: 'string',
          nullable: true,
          description: 'Href link for the collection',
        },
      },
      required: ['id'],
    },

    AttributeOption: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the AttributeOption',
        },
        value: {
          type: 'array',
          items: { type: 'string' },
          description: 'Values for the attribute option',
          nullable: false,
        },
        attribute: {
          $ref: '#/definitions/Attribute',
          description: 'Relation to Attribute',
        },
      },
      required: ['id', 'value'],
    },
    Billing: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the Billing',
        },
        customer: {
          $ref: '#/definitions/Customer',
          description: 'Relation to Customer',
        },
        firstName: {
          type: 'string',
          description: 'First name of the customer',
        },
        lastName: { type: 'string', description: 'Last name of the customer' },
        address1: { type: 'string', description: 'Primary address' },
        address2: {
          type: 'string',
          nullable: true,
          description: 'Secondary address',
        },
        city: { type: 'string', description: 'City' },
        state: { type: 'string', description: 'State' },
        postcode: { type: 'string', description: 'Postal code' },
        country: { type: 'string', description: 'Country' },
        email: { type: 'string', nullable: true, description: 'Email address' },
        phone: { type: 'string', nullable: true, description: 'Phone number' },
      },
      required: [
        'id',
        'firstName',
        'lastName',
        'address1',
        'city',
        'state',
        'postcode',
        'country',
      ],
    },
    Customer: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Unique identifier for the Customer',
        },
        wallet: {
          type: 'string',
          description: 'Wallet address of the customer',
        },
        orders: {
          type: 'array',
          items: { $ref: '#/definitions/Order' },
          description: 'List of orders related to the customer',
        },
        shipping: {
          type: 'array',
          items: { $ref: '#/definitions/Shipping' },
          description: 'List of shipping details related to the customer',
        },
        billing: {
          type: 'array',
          items: { $ref: '#/definitions/Billing' },
          description: 'List of billing details related to the customer',
        },
        isActive: {
          type: 'boolean',
          default: true,
          description: 'Indicates if the customer is active',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date when the customer was created',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date when the customer was last updated',
        },
      },
      required: ['id', 'wallet', 'isActive'],
    },
    Shipping: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the Shipping',
        },
        customer: {
          $ref: '#/definitions/Customer',
          description: 'Relation to Customer',
        },
        firstName: {
          type: 'string',
          description: 'First name of the customer',
        },
        lastName: { type: 'string', description: 'Last name of the customer' },
        address1: { type: 'string', description: 'Primary address' },
        address2: {
          type: 'string',
          nullable: true,
          description: 'Secondary address',
        },
        city: { type: 'string', description: 'City' },
        state: { type: 'string', description: 'State' },
        postcode: { type: 'string', description: 'Postal code' },
        country: { type: 'string', description: 'Country' },
      },
      required: [
        'id',
        'firstName',
        'lastName',
        'address1',
        'city',
        'state',
        'postcode',
        'country',
      ],
    },
    Attribute: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the Attribute',
        },
        attributeId: { type: 'number', description: 'Attribute ID' },
        name: { type: 'string', description: 'Name of the attribute' },
        position: {
          type: 'integer',
          nullable: true,
          description: 'Position of the attribute',
        },
        visible: {
          type: 'boolean',
          nullable: true,
          description: 'Visibility of the attribute',
        },
        variation: {
          type: 'boolean',
          nullable: true,
          description: 'Whether the attribute is a variation',
        },
        options: {
          type: 'array',
          items: { $ref: '#/definitions/AttributeOption' },
          description: 'List of attribute options',
        },
        woocommerceProduct: {
          type: 'array',
          items: { $ref: '#/definitions/WoocommerceProduct' },
          description: 'Relation to WoocommerceProduct',
        },
      },
      required: ['id', 'attributeId', 'name'],
    },
    DGLResponseUser: {
      data: {
        $ref: '#/definitions/User',
      },
      status: {
        type: 'integer',
        description: 'HTTP status code',
      },
      message: {
        type: 'string',
        description: 'Response message',
      },
    },
    DGLResponseSlot: {
      data: {
        $ref: '#/definitions/Slot',
      },
      status: {
        type: 'integer',
        description: 'HTTP status code',
      },
      message: {
        type: 'string',
        description: 'Response message',
      },
    },
    DGLResponseWoocommerceProducts: {
      data: {
        $ref: '#/definitions/WoocommerceProduct',
      },
      status: 200,
      message: 'Products fetched successfully',
    },
  },
};

const outputFile = '../public/swagger.json';
const routes = ['../src/routes/routes.ts'];

swaggerAutogen()(outputFile, routes, doc);
