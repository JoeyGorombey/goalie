const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Goalie API',
      version: '2.0.0',
      description: '🥅 Goal tracking application API with SQLite database',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Goals',
        description: 'Goal management endpoints',
      },
      {
        name: 'Milestones',
        description: 'Milestone management endpoints',
      },
    ],
    components: {
      schemas: {
        Goal: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Goal ID',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Goal title',
              example: 'Learn Spanish',
            },
            description: {
              type: 'string',
              description: 'Goal description',
              example: 'Become fluent in conversational Spanish',
            },
            dueDate: {
              type: 'string',
              nullable: true,
              description: 'Due date in human-readable format',
              example: 'Dec 31, 2025',
            },
            milestones: {
              type: 'array',
              description: 'Array of milestones for this goal',
              items: {
                $ref: '#/components/schemas/Milestone',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Milestone: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Milestone ID',
              example: 1,
            },
            goalId: {
              type: 'integer',
              description: 'Parent goal ID',
              example: 1,
            },
            text: {
              type: 'string',
              description: 'Milestone text',
              example: 'Complete Duolingo Unit 1',
            },
            completed: {
              type: 'boolean',
              description: 'Completion status',
              example: false,
            },
            dueDate: {
              type: 'string',
              nullable: true,
              description: 'Due date in YYYY-MM-DD format',
              example: '2025-11-15',
            },
            position: {
              type: 'integer',
              description: 'Display order position',
              example: 0,
            },
          },
        },
        CreateGoalRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: 'Goal title (required)',
              example: 'Learn Spanish',
            },
            description: {
              type: 'string',
              description: 'Goal description (optional)',
              example: 'Become fluent in conversational Spanish',
            },
            dueDate: {
              type: 'string',
              nullable: true,
              description: 'Due date (optional)',
              example: 'Dec 31, 2025',
            },
            steps: {
              type: 'array',
              description: 'Initial milestones/steps (optional)',
              items: {
                type: 'string',
              },
              example: ['Complete Duolingo Unit 1', 'Practice daily for 30 minutes'],
            },
          },
        },
        UpdateGoalRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Updated goal title',
              example: 'Master Spanish',
            },
            description: {
              type: 'string',
              description: 'Updated goal description',
              example: 'Achieve C1 level fluency',
            },
            dueDate: {
              type: 'string',
              nullable: true,
              description: 'Updated due date',
              example: 'Jun 30, 2026',
            },
            milestones: {
              type: 'array',
              description: 'Reordered milestones (for position updates)',
              items: {
                $ref: '#/components/schemas/Milestone',
              },
            },
          },
        },
        CreateMilestoneRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              description: 'Milestone text (required)',
              example: 'Complete grammar exercises',
            },
          },
        },
        UpdateMilestoneRequest: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Updated milestone text',
              example: 'Complete advanced grammar exercises',
            },
            dueDate: {
              type: 'string',
              nullable: true,
              description: 'Milestone due date in YYYY-MM-DD format (null to clear)',
              example: '2025-11-20',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Goal not found',
            },
          },
        },
      },
    },
  },
  apis: ['./server.js'],
};

module.exports = swaggerJsdoc(options);

