/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProductsController } from './../controllers/catalogController.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DashboardController } from './../controllers/dashboardController.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MagentoController } from './../controllers/magentoController.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ShippingController } from './../controllers/shippingController.js';
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Datasource": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "user": {"ref":"User","required":true},
            "woocommerceProduct": {"dataType":"array","array":{"dataType":"refObject","ref":"WoocommerceProduct"},"required":true},
            "platform": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["woocommerce"]},{"dataType":"enum","enums":["magento"]}],"required":true},
            "baseUrl": {"dataType":"string","required":true},
            "consumerKey": {"dataType":"string","required":true},
            "consumerSecret": {"dataType":"string","required":true},
            "accessToken": {"dataType":"string","required":true},
            "accessTokenSecret": {"dataType":"string","required":true},
            "webhookSecret": {"dataType":"string","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "username": {"dataType":"string","required":true},
            "apiKey": {"dataType":"string","required":true},
            "datasource": {"dataType":"array","array":{"dataType":"refObject","ref":"Datasource"},"required":true},
            "isActive": {"dataType":"boolean","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WoocommerceProduct": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "productId": {"dataType":"double","required":true},
            "datasource": {"ref":"Datasource","required":true},
            "syncedAt": {"dataType":"datetime","required":true},
            "datasourceId": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "permalink": {"dataType":"string","required":true},
            "dateCreated": {"dataType":"string","required":true},
            "dateCreatedGmt": {"dataType":"string","required":true},
            "dateModified": {"dataType":"string","required":true},
            "dateModifiedGmt": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "featured": {"dataType":"boolean","required":true},
            "catalogVisibility": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "shortDescription": {"dataType":"string","required":true},
            "sku": {"dataType":"string","required":true},
            "price": {"dataType":"string","required":true},
            "regularPrice": {"dataType":"string","required":true},
            "salePrice": {"dataType":"string","required":true},
            "dateOnSaleFrom": {"dataType":"string","required":true},
            "dateOnSaleFromGmt": {"dataType":"string","required":true},
            "dateOnSaleTo": {"dataType":"string","required":true},
            "dateOnSaleToGmt": {"dataType":"string","required":true},
            "priceHtml": {"dataType":"string","required":true},
            "onSale": {"dataType":"boolean","required":true},
            "purchasable": {"dataType":"boolean","required":true},
            "totalSales": {"dataType":"double","required":true},
            "virtual": {"dataType":"boolean","required":true},
            "downloadable": {"dataType":"boolean","required":true},
            "downloads": {"dataType":"string","required":true},
            "downloadLimit": {"dataType":"double","required":true},
            "downloadExpiry": {"dataType":"double","required":true},
            "externalUrl": {"dataType":"string","required":true},
            "buttonText": {"dataType":"string","required":true},
            "taxStatus": {"dataType":"string","required":true},
            "taxClass": {"dataType":"string","required":true},
            "manageStock": {"dataType":"boolean","required":true},
            "stockQuantity": {"dataType":"string","required":true},
            "stockStatus": {"dataType":"string","required":true},
            "backorders": {"dataType":"string","required":true},
            "backordersAllowed": {"dataType":"boolean","required":true},
            "backordered": {"dataType":"boolean","required":true},
            "soldIndividually": {"dataType":"boolean","required":true},
            "weight": {"dataType":"string","required":true},
            "shippingRequired": {"dataType":"boolean","required":true},
            "shippingTaxable": {"dataType":"boolean","required":true},
            "shippingClass": {"dataType":"string","required":true},
            "shippingClassId": {"dataType":"double","required":true},
            "reviewsAllowed": {"dataType":"boolean","required":true},
            "averageRating": {"dataType":"string","required":true},
            "ratingCount": {"dataType":"double","required":true},
            "relatedIds": {"dataType":"string","required":true},
            "upsellIds": {"dataType":"string","required":true},
            "crossSellIds": {"dataType":"string","required":true},
            "parentId": {"dataType":"double","required":true},
            "purchaseNote": {"dataType":"string","required":true},
            "defaultAttributes": {"dataType":"array","array":{"dataType":"any"},"required":true},
            "variations": {"dataType":"string","required":true},
            "groupedProducts": {"dataType":"string","required":true},
            "menuOrder": {"dataType":"double","required":true},
            "jetpackPublicizeConnections": {"dataType":"string","required":true},
            "dimensions": {"ref":"Dimensions","required":true},
            "images": {"dataType":"array","array":{"dataType":"refObject","ref":"Image"},"required":true},
            "categories": {"dataType":"array","array":{"dataType":"refObject","ref":"Category"},"required":true},
            "tags": {"dataType":"array","array":{"dataType":"refObject","ref":"Tag"},"required":true},
            "attributes": {"dataType":"array","array":{"dataType":"refObject","ref":"Attribute"},"required":true},
            "metaData": {"dataType":"array","array":{"dataType":"refObject","ref":"MetaData"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Dimensions": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "length": {"dataType":"string","required":true},
            "width": {"dataType":"string","required":true},
            "height": {"dataType":"string","required":true},
            "woocommerceProduct": {"ref":"WoocommerceProduct","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Image": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "imageId": {"dataType":"double","required":true},
            "dateCreated": {"dataType":"string","required":true},
            "dateCreatedGmt": {"dataType":"string","required":true},
            "dateModified": {"dataType":"string","required":true},
            "dateModifiedGmt": {"dataType":"string","required":true},
            "src": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "alt": {"dataType":"string","required":true},
            "woocommerceProduct": {"ref":"WoocommerceProduct","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Category": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "categoryId": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "woocommerceProduct": {"ref":"WoocommerceProduct","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Tag": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "tagId": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "woocommerceProduct": {"ref":"WoocommerceProduct","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Attribute": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "attributeId": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "position": {"dataType":"double","required":true},
            "visible": {"dataType":"boolean","required":true},
            "variation": {"dataType":"boolean","required":true},
            "options": {"dataType":"string","required":true},
            "woocommerceProduct": {"ref":"WoocommerceProduct","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetaData": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "metaDataId": {"dataType":"double","required":true},
            "key": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
            "woocommerceProduct": {"ref":"WoocommerceProduct","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DGLResponse_WoocommerceProduct-Array_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"WoocommerceProduct"},"required":true},
            "status": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DGLResponse_any_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"any","required":true},
            "status": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DGLResponse_User_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"User","required":true},
            "status": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SaveUserReq": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "apiKey": {"dataType":"string","required":true},
            "masterKey": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DGLResponse_Datasource_": {
        "dataType": "refObject",
        "properties": {
            "data": {"ref":"Datasource","required":true},
            "status": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SaveUserDatasourceReq": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "platform": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["woocommerce"]},{"dataType":"enum","enums":["magento"]}],"required":true},
            "consumerKey": {"dataType":"string","required":true},
            "consumerSecret": {"dataType":"string","required":true},
            "accessToken": {"dataType":"string"},
            "accessTokenSecret": {"dataType":"string"},
            "baseUrl": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DGLResponse_Datasource-Array_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"Datasource"},"required":true},
            "status": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Self": {
        "dataType": "refObject",
        "properties": {
            "href": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Collection": {
        "dataType": "refObject",
        "properties": {
            "href": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Describedby": {
        "dataType": "refObject",
        "properties": {
            "href": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Links": {
        "dataType": "refObject",
        "properties": {
            "self": {"dataType":"array","array":{"dataType":"refObject","ref":"Self"},"required":true},
            "collection": {"dataType":"array","array":{"dataType":"refObject","ref":"Collection"},"required":true},
            "describedby": {"dataType":"array","array":{"dataType":"refObject","ref":"Describedby"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WoocomerceShippingZone": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "order": {"dataType":"double","required":true},
            "_links": {"ref":"Links","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DGLResponse_WoocomerceShippingZone-Array_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"WoocomerceShippingZone"},"required":true},
            "status": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/v1/catalog/:datasourceId',
            ...(fetchMiddlewares<RequestHandler>(ProductsController)),
            ...(fetchMiddlewares<RequestHandler>(ProductsController.prototype.getCatalog)),

            function ProductsController_getCatalog(request: any, response: any, next: any) {
            const args = {
                    apiKey: {"in":"header","name":"api-key","required":true,"dataType":"string"},
                    datasourceId: {"in":"path","name":"datasourceId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProductsController();


              const promise = controller.getCatalog.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/catalog/sync/:datasourceId',
            ...(fetchMiddlewares<RequestHandler>(ProductsController)),
            ...(fetchMiddlewares<RequestHandler>(ProductsController.prototype.syncCatalog)),

            function ProductsController_syncCatalog(request: any, response: any, next: any) {
            const args = {
                    apiKey: {"in":"header","name":"api-key","required":true,"dataType":"string"},
                    datasourceId: {"in":"path","name":"datasourceId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProductsController();


              const promise = controller.syncCatalog.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/v1/dashboard/user',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.createUser)),

            function DashboardController_createUser(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"SaveUserReq"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DashboardController();


              const promise = controller.createUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/v1/dashboard/user/datasource',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.saveUserDatasource)),

            function DashboardController_saveUserDatasource(request: any, response: any, next: any) {
            const args = {
                    apiKey: {"in":"header","name":"api-key","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"SaveUserDatasourceReq"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DashboardController();


              const promise = controller.saveUserDatasource.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/dashboard/user/datasource',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getUserDatasources)),

            function DashboardController_getUserDatasources(request: any, response: any, next: any) {
            const args = {
                    apiKey: {"in":"header","name":"api-key","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DashboardController();


              const promise = controller.getUserDatasources.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/dashboard/user/datasource/:datasourceId',
            ...(fetchMiddlewares<RequestHandler>(DashboardController)),
            ...(fetchMiddlewares<RequestHandler>(DashboardController.prototype.getUserDatasource)),

            function DashboardController_getUserDatasource(request: any, response: any, next: any) {
            const args = {
                    apiKey: {"in":"header","name":"api-key","required":true,"dataType":"string"},
                    datasourceId: {"in":"path","name":"datasourceId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DashboardController();


              const promise = controller.getUserDatasource.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/magento/catalog/:datasourceId',
            ...(fetchMiddlewares<RequestHandler>(MagentoController)),
            ...(fetchMiddlewares<RequestHandler>(MagentoController.prototype.getCatalog)),

            function MagentoController_getCatalog(request: any, response: any, next: any) {
            const args = {
                    apiKey: {"in":"header","name":"api-key","required":true,"dataType":"string"},
                    datasourceId: {"in":"path","name":"datasourceId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new MagentoController();


              const promise = controller.getCatalog.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/v1/shipping/:datasourceId',
            ...(fetchMiddlewares<RequestHandler>(ShippingController)),
            ...(fetchMiddlewares<RequestHandler>(ShippingController.prototype.getShippings)),

            function ShippingController_getShippings(request: any, response: any, next: any) {
            const args = {
                    apiKey: {"in":"header","name":"api-key","required":true,"dataType":"string"},
                    datasourceId: {"in":"path","name":"datasourceId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ShippingController();


              const promise = controller.getShippings.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 200, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200)
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
