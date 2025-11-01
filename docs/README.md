# 📚 Goalie App Documentation

Welcome to the Goalie documentation! This directory contains all feature documentation and API references.

---

## 📖 Table of Contents

### 🎯 Feature Documentation

1. **[Celebration Feature](./CELEBRATION_FEATURE.md)**
   - 🎉 Congratulations modal when goals reach 100%
   - Share functionality with native share API
   - Beautiful animations and visual design

2. **[Goal Status Feature](./GOAL_STATUS_FEATURE.md)**
   - 🎯 Active, Completed status tracking
   - Automatic completion on 100% progress
   - Database schema updates
   - Status badges on cards and details

3. **[Milestone Sorting & Status Feature](./MILESTONE_SORTING_STATUS_FEATURE.md)**
   - 📅 Automatic milestone sorting by due date
   - ⏰ Behind status (overdue milestones)
   - ⚠️ Late status (overdue goal)
   - 🚨 Late & Behind combined status
   - Visual overdue indicators

---

## 🔧 API Documentation

### **[API Reference](./API_DOCS.md)**
- Complete REST API documentation
- Request/response examples
- cURL command samples
- Quick start guide

### **[Swagger UI](http://localhost:3001/api-docs)**
- Interactive API documentation
- Live testing interface
- Schema definitions
- Available when server is running

---

## 🗄️ Database Documentation

**Located in:** `server/db/README.md`

- Database schema details
- Migration scripts
- SQLite setup and usage
- Table relationships

---

## 🏗️ Project Structure

```
goalie/
├── docs/                    # 📚 This directory - All documentation
│   ├── README.md           # This file
│   ├── CELEBRATION_FEATURE.md
│   ├── GOAL_STATUS_FEATURE.md
│   ├── MILESTONE_SORTING_STATUS_FEATURE.md
│   └── API_DOCS.md
│
├── src/                     # ⚛️ Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page-level components
│   ├── services/           # API client functions
│   ├── context/            # React Context providers
│   └── utils/              # Helper functions
│
├── server/                  # 🖥️ Backend Express server
│   ├── db/                 # Database files & migrations
│   ├── data/               # JSON backup files
│   ├── server.js           # Main server file
│   └── swagger.js          # Swagger configuration
│
└── public/                  # 🌐 Static assets
```

---

## 🚀 Quick Links

### **Getting Started**
- [Main README](../README.md) - Project setup and installation

### **Development**
- [Server README](../server/README.md) - Backend setup
- [Database README](../server/db/README.md) - Database info

### **Features**
- [Celebration Feature](./CELEBRATION_FEATURE.md) - Goal completion modal
- [Status System](./GOAL_STATUS_FEATURE.md) - Goal status tracking
- [Milestone Sorting](./MILESTONE_SORTING_STATUS_FEATURE.md) - Smart milestone ordering

### **API**
- [API Docs](./API_DOCS.md) - REST API reference
- [Swagger UI](http://localhost:3001/api-docs) - Interactive docs

---

## 📊 Feature Status

| Feature | Status | Version | Docs |
|---------|--------|---------|------|
| Goal Management | ✅ Complete | 1.0 | [API Docs](./API_DOCS.md) |
| Milestone Tracking | ✅ Complete | 1.0 | [API Docs](./API_DOCS.md) |
| Celebration Modal | ✅ Complete | 2.0 | [Celebration](./CELEBRATION_FEATURE.md) |
| Status Tracking | ✅ Complete | 2.1 | [Status](./GOAL_STATUS_FEATURE.md) |
| Milestone Sorting | ✅ Complete | 2.2 | [Sorting](./MILESTONE_SORTING_STATUS_FEATURE.md) |
| Behind/Late Detection | ✅ Complete | 2.2 | [Sorting](./MILESTONE_SORTING_STATUS_FEATURE.md) |
| Abandoned Status | 🚧 Planned | 2.3 | TBD |

---

## 🎯 Terminology

### Goal States
- **Active** - Goal is in progress
- **Completed** - All milestones done
- **On Track** - No overdue items
- **Behind** - Has overdue milestones
- **Late** - Goal deadline passed
- **Late & Behind** - Both goal and milestones overdue
- **Abandoned** - No activity for 30+ days (planned)

### Milestone States
- **Completed** - Checked off
- **Pending** - Not yet done
- **Overdue** - Past due date and incomplete

---

## 📝 Contributing

When adding new features:
1. Create feature documentation in `docs/`
2. Update this README with links
3. Add to Feature Status table
4. Update API docs if endpoints change
5. Keep screenshots/examples updated

---

## 🔗 External Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [SQLite Documentation](https://sqlite.org/docs.html)
- [Swagger/OpenAPI Spec](https://swagger.io/docs/)

---

**Last Updated:** November 1, 2025  
**Documentation Version:** 2.2  
**App Version:** 2.2.0

