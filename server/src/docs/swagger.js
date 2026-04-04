import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Finance Data Processing and Access Control API",
      version: "1.0.0",
      description:
        "Backend assignment API covering role-based access, financial records CRUD, dashboard summaries, validation, and PostgreSQL persistence with Prisma."
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Validation failed" }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@finance.local" },
            password: { type: "string", example: "Password@123" }
          }
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: {
              $ref: "#/components/schemas/User"
            }
          }
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string", example: "Admin User" },
            email: { type: "string", example: "admin@finance.local" },
            role: { type: "string", enum: ["ADMIN", "ANALYST", "VIEWER"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
            createdById: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string", example: "Jane Analyst" },
            email: { type: "string", example: "jane@finance.local" },
            password: { type: "string", example: "Password@123" },
            role: { type: "string", enum: ["ADMIN", "ANALYST", "VIEWER"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"], example: "ACTIVE" }
          }
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Jane Updated" },
            password: { type: "string", example: "Password@123" },
            role: { type: "string", enum: ["ADMIN", "ANALYST", "VIEWER"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] }
          }
        },
        UserListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/User" }
            },
            meta: {
              type: "object",
              properties: {
                page: { type: "number", example: 1 },
                limit: { type: "number", example: 10 },
                total: { type: "number", example: 3 }
              }
            }
          }
        },
        Record: {
          type: "object",
          properties: {
            id: { type: "string" },
            amount: { type: "number", example: 1200 },
            type: { type: "string", enum: ["INCOME", "EXPENSE"] },
            category: { type: "string", example: "Rent" },
            date: { type: "string", format: "date-time" },
            description: { type: "string", nullable: true, example: "Apartment rent" },
            createdById: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        CreateRecordRequest: {
          type: "object",
          required: ["amount", "type", "category", "date"],
          properties: {
            amount: { type: "number", example: 199.99 },
            type: { type: "string", enum: ["INCOME", "EXPENSE"] },
            category: { type: "string", example: "Software" },
            date: { type: "string", format: "date-time", example: "2026-04-01T00:00:00.000Z" },
            description: { type: "string", example: "Subscription renewal" }
          }
        },
        UpdateRecordRequest: {
          type: "object",
          properties: {
            amount: { type: "number", example: 220 },
            type: { type: "string", enum: ["INCOME", "EXPENSE"] },
            category: { type: "string", example: "Utilities" },
            date: { type: "string", format: "date-time" },
            description: { type: "string", nullable: true, example: "Updated note" }
          }
        },
        RecordListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Record" }
            },
            meta: {
              type: "object",
              properties: {
                page: { type: "number", example: 1 },
                limit: { type: "number", example: 10 },
                total: { type: "number", example: 5 }
              }
            }
          }
        },
        DashboardSummary: {
          type: "object",
          properties: {
            totals: {
              type: "object",
              properties: {
                income: { type: "number", example: 5700 },
                expenses: { type: "number", example: 1670.5 },
                netBalance: { type: "number", example: 4029.5 }
              }
            },
            categoryTotals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string", example: "Salary" },
                  total: { type: "number", example: 5000 }
                }
              }
            },
            monthlyTrends: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  month: { type: "string", example: "2026-03" },
                  income: { type: "number", example: 5700 },
                  expenses: { type: "number", example: 1670.5 },
                  net: { type: "number", example: 4029.5 }
                }
              }
            },
            recentActivity: {
              type: "array",
              items: { $ref: "#/components/schemas/Record" }
            }
          }
        }
      }
    },
    paths: {
      "/api/health": {
        get: {
          summary: "Health check",
          responses: {
            200: {
              description: "API is healthy",
              content: {
                "application/json": {
                  example: { status: "ok" }
                }
              }
            }
          }
        }
      },
      "/api/auth/login": {
        post: {
          summary: "Login user",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" }
              }
            }
          },
          responses: {
            200: {
              description: "Authenticated successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" }
                }
              }
            },
            401: {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            }
          }
        }
      },
      "/api/users": {
        get: {
          summary: "List users",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "User list",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserListResponse" }
                }
              }
            }
          }
        },
        post: {
          summary: "Create user",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateUserRequest" }
              }
            }
          },
          responses: {
            201: {
              description: "User created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" }
                }
              }
            },
            409: {
              description: "Duplicate email",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            }
          }
        }
      },
      "/api/users/{id}": {
        patch: {
          summary: "Update user",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateUserRequest" }
              }
            }
          },
          responses: {
            200: {
              description: "User updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" }
                }
              }
            }
          }
        }
      },
      "/api/records": {
        get: {
          summary: "List financial records",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "query", name: "type", schema: { type: "string", enum: ["INCOME", "EXPENSE"] } },
            { in: "query", name: "category", schema: { type: "string" } },
            { in: "query", name: "startDate", schema: { type: "string", format: "date-time" } },
            { in: "query", name: "endDate", schema: { type: "string", format: "date-time" } }
          ],
          responses: {
            200: {
              description: "Financial record list",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/RecordListResponse" }
                }
              }
            }
          }
        },
        post: {
          summary: "Create financial record",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateRecordRequest" }
              }
            }
          },
          responses: {
            201: {
              description: "Financial record created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Record" }
                }
              }
            }
          }
        }
      },
      "/api/records/{id}": {
        get: {
          summary: "Get one financial record",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            200: {
              description: "Financial record found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Record" }
                }
              }
            }
          }
        },
        patch: {
          summary: "Update financial record",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateRecordRequest" }
              }
            }
          },
          responses: {
            200: {
              description: "Financial record updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Record" }
                }
              }
            }
          }
        },
        delete: {
          summary: "Delete financial record",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            204: {
              description: "Financial record deleted"
            }
          }
        }
      },
      "/api/dashboard/summary": {
        get: {
          summary: "Get dashboard summary",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Dashboard summary",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DashboardSummary" }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: []
});
