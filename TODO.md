# TODO.md - Fix Dashboard coursesWithTeacher Count

## ✅ Plan Approved: Option 1 - Backend Populate Fix

**Status: [1/3] ✓**

### Step 1: ✅ COMPLETED - Backend Controller Fixed
- **File:** `backend/src/controllers/course.controller.js`
- **Change:** Added `.populate('teacher', 'name email post avatar')` to `getAllCoursesForDropdown()`
- **Next:** Test endpoint

### Step 2: [PENDING] Test Backend Endpoint
```
curl -H \"Cookie: your-auth-cookie\" http://localhost:3000/api/courses/all | jq '.[0].teacher[0].name'
Expected: Returns Teacher names (_id, name, etc.) not ObjectIds
```

### Step 3: [PENDING] Verify Frontend Dashboard
- Refresh Dashboard → \"Courses with Teachers\" shows correct count  
- Progress bar: `(coursesWithTeacher / courseCount) * 100`
- Console: `courses[0].teacher[0].name` exists

---
**Next Action:** Test `/api/courses/all` → Verify dashboard


