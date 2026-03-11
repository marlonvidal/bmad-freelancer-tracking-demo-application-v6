# Story 1.7: Add Subtasks and Quick-Add for Tasks

**Status:** ready-for-dev

**Story ID:** 1.7 | **Epic:** 1 - Foundation & Core Kanban | **Sequence:** 7 of 7

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a freelancer,
I want to create subtasks for larger tasks and add tasks quickly with minimal fields,
So that I can break down work and capture tasks fast.

## Acceptance Criteria

### AC 1: Create Subtasks for a Task
**Given** a task from Story 1.6
**When** I click on a task to open the detail panel
**Then** I see a "Subtasks" section with option to add new subtasks (FR7)
**And** I can enter a subtask title (required, max 255 chars)
**And** each subtask is displayed as a checkbox item under the parent task
**And** I can mark subtasks as complete/incomplete
**And** subtask data persists to Dexie with parent task ID and order

### AC 2: Display Subtasks on Task Cards
**Given** a task with subtasks from AC 1
**When** I view the task card on the kanban board
**Then** I see a subtask summary (e.g., "2/3 subtasks done")
**And** the summary is displayed compactly without cluttering the card
**And** clicking on the task card opens the detail panel to manage subtasks

### AC 3: Quick-Add Task with Minimal Fields
**Given** the kanban board from Story 1.6
**When** I click on a quick-add button or field
**Then** I can enter just a title (required) with minimal UI friction (FR8)
**And** the quick-add creates a task in the selected or default column
**And** the task has sensible defaults: priority=Medium, completed=false, order=auto
**And** after creating, I can expand to full fields if needed or start a new quick-add

### AC 4: Quick-Add Expansion to Full Fields
**Given** a task created via quick-add from AC 3
**When** I want to add more details (description, due date, priority, tags)
**Then** I can click "Edit" or a chevron to expand the form
**And** the full task edit form opens
**And** defaults are pre-filled (title, columnId, priority, etc.)
**And** I can complete the form and save

### AC 5: Quick-Add Keyboard Shortcut
**Given** the board with quick-add enabled
**When** I press a keyboard shortcut (e.g., Cmd+Shift+N or Ctrl+Shift+N)
**Then** quick-add field becomes active (for the current or default column)
**And** I can type the title and press Enter to create (or Escape to cancel)
**And** after creation, the focus returns to the quick-add field (or board)
**And** I can quickly create multiple tasks in sequence

### AC 6: Quick-Add Column Selection
**Given** the kanban board with multiple columns
**When** I use quick-add
**Then** I can select which column to add the task to (or use a default)
**And** if I drag a task from one column to another, the next quick-add defaults to the last active column
**And** the selected column is visually indicated

### AC 7: Subtask Order and Persistence
**Given** subtasks in a task from AC 1
**When** I reorder subtasks (drag-and-drop or arrow buttons)
**Then** the new order persists to Dexie
**And** subtask order is preserved across refresh
**And** each subtask has an order field (0, 1, 2, ...)

### AC 8: Delete Subtasks
**Given** a subtask in a task
**When** I click delete on the subtask
**Then** I see a confirmation dialog (for UX: recovery over deletion)
**And** if confirmed, the subtask is deleted from Dexie
**And** remaining subtasks' order is preserved

### AC 9: Subtask Completion State
**Given** a subtask
**When** I toggle the checkbox
**Then** the subtask's completed state updates immediately
**And** the parent task's subtask summary updates (e.g., "2/3" → "3/3")
**And** changes persist to Dexie
**And** completed subtasks are visually distinct (strikethrough, muted color)

### AC 10: Quick-Add with Auto-Focus and Blur
**Given** the quick-add field
**When** I focus on quick-add
**Then** the field is visually highlighted or focused
**And** when I blur (click away), the field returns to normal state
**And** if I typed but didn't save, the field is cleared on blur (or warns me)

### AC 11: Quick-Add Performance
**Given** a large board with 100+ tasks
**When** I create a new task via quick-add
**Then** the create operation completes in < 200ms
**And** UI remains responsive and smooth (60fps)
**And** no noticeable lag when adding multiple tasks

### AC 12: Validation and Error Messages
**Given** the quick-add or subtask form
**When** I try to save without a title
**Then** I see a validation message: "Title is required"
**And** the form does not submit
**When** I try to save with a title > 255 chars
**Then** I see a message: "Title must be 255 characters or less"

## Tasks / Subtasks

- [ ] Create Subtask schema and Dexie store (AC 1, 7, 8)
  - [ ] Define subtask schema: `id, taskId, title, completed, order, createdAt, updatedAt`
  - [ ] Add Zod schema for subtask validation
  - [ ] Add `subtasks` store to Dexie: `++id, taskId, order`
  - [ ] Ensure foreign key relationship: taskId → tasks.id

- [ ] Add subtask management methods to AppContext (AC 1, 8, 9)
  - [ ] `addSubtask(taskId, title): Promise<Subtask>`
  - [ ] `deleteSubtask(subtaskId): Promise<void>`
  - [ ] `toggleSubtaskCompletion(subtaskId): Promise<void>`
  - [ ] `updateSubtaskOrder(subtaskId, newOrder): Promise<void>`
  - [ ] All methods validate data with Zod and persist to Dexie

- [ ] Update Task schema to include subtasks array (AC 2)
  - [ ] Add computed field or query tasks with subtasks: load subtasks for each task
  - [ ] Consider: load subtasks on-demand vs. pre-load (choose based on performance testing)

- [ ] Create SubtasksPanel component for task detail panel (AC 1, 8, 9)
  - [ ] Display list of subtasks for a task
  - [ ] Show checkbox for each subtask with completion toggle
  - [ ] Show subtask title and edited timestamp
  - [ ] Add "Add Subtask" button/field
  - [ ] Add delete button with confirmation
  - [ ] Support drag-and-drop or arrow buttons to reorder subtasks
  - [ ] Show visual feedback for completed subtasks (strikethrough, muted)
  - [ ] Validate subtask title on input (required, max 255 chars)

- [ ] Update TaskDetailPanel/Sheet to include SubtasksPanel (AC 1, 2)
  - [ ] Add SubtasksPanel section below task fields
  - [ ] Keep subtask management within the panel (not interrupting main form)
  - [ ] Ensure layout remains clean and scannable

- [ ] Create TaskSummary component for task card (AC 2)
  - [ ] Display compact subtask summary: "X/Y subtasks done" or "0 subtasks"
  - [ ] If task has subtasks, show summary badge or text
  - [ ] Use muted color if all done, highlight if in progress

- [ ] Create QuickAddField component for task cards (AC 3, 4, 5, 10)
  - [ ] Render a single input field for quick task creation
  - [ ] Placeholder: "Add a task..."
  - [ ] On Enter: validate title, create task via AppContext, clear field
  - [ ] On Escape: clear field and blur
  - [ ] Show validation error if title is empty
  - [ ] Focus management: auto-focus on mount (optional)
  - [ ] Blur behavior: clear field if empty, or warn if unsaved content

- [ ] Integrate QuickAddField into KanbanBoard (AC 3, 6)
  - [ ] Add quick-add field below each column (or at the top)
  - [ ] Default to the current column or allow column selection
  - [ ] Track last active column for next quick-add
  - [ ] Display visual indicator of selected column
  - [ ] On task creation, update the default column

- [ ] Implement Quick-Add Keyboard Shortcut (AC 5)
  - [ ] Register global keyboard shortcut: Cmd+Shift+N (Mac) or Ctrl+Shift+N (Windows/Linux)
  - [ ] On shortcut, focus the quick-add field (in default or last active column)
  - [ ] Allow typing immediately
  - [ ] Press Enter to create, Escape to cancel

- [ ] Create QuickAddExpandedForm component (AC 4)
  - [ ] Show full task form when expanding quick-add
  - [ ] Pre-fill title from quick-add
  - [ ] Allow editing all task fields
  - [ ] Save to task and close form (or stay in quick-add mode)

- [ ] Add Subtask Count to Task Schema (AC 2)
  - [ ] Add computed property: `subtaskCount?: number`
  - [ ] Query count of subtasks for each task
  - [ ] Update on subtask creation/deletion

- [ ] Handle subtask creation with proper order (AC 7)
  - [ ] Assign order = max(existing orders) + 1 on creation
  - [ ] Keep order consistent

- [ ] Update AppContext to Load Subtasks (AC 1, 2)
  - [ ] On app load: fetch all subtasks from Dexie
  - [ ] Store subtasks in state alongside tasks
  - [ ] Keep subtasks in sync with tasks (when tasks change, refresh subtasks if needed)

- [ ] Test Subtasks Full Workflow (AC 1-9)
  - [ ] Create task, add subtasks, verify persistence
  - [ ] Mark subtask complete, verify checkbox and summary update
  - [ ] Delete subtask, verify confirmation and remaining order intact
  - [ ] Reorder subtasks, verify order persists
  - [ ] Open task detail panel, verify subtasks show
  - [ ] Close and reopen panel, verify subtasks retained
  - [ ] Refresh page, verify subtasks and completion state persist

- [ ] Test Quick-Add Full Workflow (AC 3-6, 10, 11, 12)
  - [ ] Click quick-add, type title, press Enter, verify task created
  - [ ] Quick-add in different columns, verify tasks in correct columns
  - [ ] Use keyboard shortcut to create multiple tasks
  - [ ] Blur quick-add field, verify behavior (clear if empty, warn if unsaved)
  - [ ] Try to create with empty title, verify validation message
  - [ ] Try to create with long title (>255), verify truncation or error
  - [ ] Create 100 tasks quickly, measure performance (target < 200ms per create)
  - [ ] Verify UI remains responsive (60fps)

- [ ] Accessibility Testing (AC 1-3, 5)
  - [ ] Test keyboard navigation: Tab through subtask items, delete buttons, add button
  - [ ] Test screen reader: announces subtask title, completion state, order
  - [ ] Test keyboard shortcut: works with keyboard focus on board
  - [ ] Verify ARIA labels on quick-add field and expand button
  - [ ] Test with prefers-reduced-motion: animations disabled but functionality intact

- [ ] Performance Optimization (AC 11)
  - [ ] Measure subtask query performance (Dexie index on taskId, order)
  - [ ] Measure quick-add creation time (target < 200ms)
  - [ ] Profile render performance with large task/subtask lists
  - [ ] Consider: memoization of components if needed
  - [ ] Verify 60fps during interactions

- [ ] Error Handling (AC 12)
  - [ ] Validate title with Zod: required, max 255 chars
  - [ ] Show user-friendly validation messages
  - [ ] Catch Dexie errors, show "Failed to save subtask. Please try again."
  - [ ] No silent failures

- [ ] Update Documentation
  - [ ] Update epics.md to mark 1.7 as complete
  - [ ] Add subtask examples to README if needed
  - [ ] Document keyboard shortcuts in settings panel (Story 4.4)

- [ ] TypeScript and Build (AC 12)
  - [ ] Ensure all Zod schemas compile
  - [ ] Run `npm run build` and verify no errors
  - [ ] Run `npm run dev` and verify app starts
  - [ ] Fix any TypeScript errors

- [ ] Git Commit (All)
  - [ ] Stage all changes
  - [ ] Commit with message: `feat(story-1.7): Add subtasks and quick-add for tasks`
  - [ ] Verify commit is on main/dev branch

## Dev Notes

### Relevant Architecture Patterns and Constraints

**From Architecture:**
- **State Management:** React Context (AppContext) for tasks and subtasks; sync to Dexie on every change
- **Data Persistence:** Dexie.js with stores: `tasks`, `subtasks` (new); foreign key relationship
- **Validation:** Zod 4.x for subtask schema and form data validation
- **Keyboard Support:** Global keyboard shortcut for quick-add (Cmd+Shift+N or Ctrl+Shift+N); Tab and arrow keys for subtask navigation
- **Accessibility:** ARIA labels, focus management, screen reader announcements for subtask completion
- **Error Handling:** React Error Boundaries; user-facing actionable messages; no silent failures
- **Performance:** Quick-add must complete < 200ms; 60fps for interactions; optimize Dexie queries

**From UX Design:**
- **Quick-Add Field:** Minimal UI, auto-focus if desired, placeholder "Add a task...", Enter to create
- **Subtask Display:** Checkbox with strikethrough for completed, subtle animations
- **Column Selection:** Visual indicator of which column tasks will be added to
- **Validation Messages:** Clear, actionable messages (e.g., "Title is required", "Title must be 255 characters or less")
- **Touch Targets:** Buttons and checkboxes at least 44×44px
- **Empty States:** Show clear CTAs for empty columns or no subtasks

**From Epic 1 Sequence & Dependencies:**
- **Story 1.7 of 7:** Final story in Epic 1
- **Depends on:** Story 1.6 (drag-and-drop must be stable)
- **Unblocks:** Epic 1 complete; Epic 2 ready to start
- **Cross-Epic Context:** Epic 2 will include timer on subtasks (future); ensure subtask structure supports this

### Source Tree Components to Touch

**New files to create:**
- `src/schemas/subtask.ts` — Zod schema for subtasks
- `src/components/SubtasksPanel.tsx` — Display and manage subtasks in task detail panel
- `src/components/QuickAddField.tsx` — Minimal input for quick task creation
- `src/components/QuickAddExpandedForm.tsx` — Full task form for expanded quick-add
- `src/components/TaskSummary.tsx` — Subtask summary badge/text on task card
- `src/hooks/useQuickAdd.ts` — Custom hook for quick-add logic
- `src/hooks/useKeyboardShortcut.ts` — Custom hook for global keyboard shortcuts

**Modified files:**
- `src/db/schema.ts` — Add `subtasks` store with indexes
- `src/schemas/task.ts` — No changes (keep existing schema)
- `src/context/AppContext.tsx` — Add subtask methods and state
- `src/components/TaskDetailPanel.tsx` or `src/components/Sheet.tsx` — Include SubtasksPanel
- `src/components/TaskCard.tsx` — Add TaskSummary badge
- `src/components/KanbanBoard.tsx` — Add QuickAddField for each column
- `src/components/SortableColumn.tsx` (from 1.6) — Integrate QuickAddField

**Expected file structure after Story 1.7:**
```
src/
├── components/
│   ├── ui/                          # shadcn
│   ├── KanbanBoard.tsx              # MODIFIED: add QuickAddField
│   ├── SortableColumn.tsx           # MODIFIED: add QuickAddField (or create layout wrapper)
│   ├── TaskCard.tsx                 # MODIFIED: add TaskSummary
│   ├── TaskDetailPanel.tsx          # MODIFIED: add SubtasksPanel
│   ├── SubtasksPanel.tsx            # NEW: subtask management
│   ├── QuickAddField.tsx            # NEW: minimal task creation
│   ├── QuickAddExpandedForm.tsx     # NEW: full task form
│   ├── TaskSummary.tsx              # NEW: subtask summary
├── schemas/
│   ├── task.ts                      # From 1.5 (unchanged)
│   ├── subtask.ts                   # NEW: Zod schema for subtasks
├── context/
│   └── AppContext.tsx               # MODIFIED: add subtask state and methods
├── db/
│   ├── schema.ts                    # MODIFIED: add subtasks store
│   └── index.ts                     # From 1.3 (unchanged)
├── hooks/
│   ├── useQuickAdd.ts               # NEW: quick-add logic
│   ├── useKeyboardShortcut.ts       # NEW: global keyboard shortcuts
│   └── useReducedMotion.ts          # From 1.6 (unchanged)
└── ...
```

### Testing Standards Summary

**Manual verification tests:**
1. **Create Subtask:** Click task, add subtask, verify it appears and persists
2. **Mark Subtask Complete:** Toggle checkbox, verify strikethrough and summary update
3. **Delete Subtask:** Delete, confirm, verify remaining subtasks intact
4. **Reorder Subtasks:** Drag or arrow buttons, verify order persists after refresh
5. **Quick-Add:** Type title, press Enter, verify task created in correct column
6. **Keyboard Shortcut:** Press Cmd+Shift+N, type, press Enter, verify task created
7. **Quick-Add Expansion:** Create via quick-add, expand to full form, add details
8. **Validation:** Try empty title, try > 255 chars, verify error messages
9. **Performance:** Create 100 tasks quickly, measure time and FPS
10. **Accessibility:** Tab through subtasks, use keyboard shortcut, screen reader announces
11. **Persistence:** Create tasks, subtasks, refresh page, verify all retained
12. **TypeScript:** `npm run build` produces no errors
13. **Dev Server:** `npm run dev` starts without errors

### Project Structure Notes

**Before (Story 1.6):**
- Tasks are fully featured (title, description, due date, priority, tags)
- No subtasks support
- No quick-add (only full task form)
- No global keyboard shortcuts

**After (Story 1.7):**
- Tasks support subtasks (stored in Dexie `subtasks` store)
- Subtask count displayed on task card
- Subtask detail panel in task detail sheet
- Quick-add field in each column for fast task creation
- Global keyboard shortcut (Cmd+Shift+N / Ctrl+Shift+N) for quick-add
- QuickAddExpandedForm for editing quick-added tasks
- Full keyboard navigation for subtask management

### Key Data Structures

**New Subtask Schema (Zod):**
```typescript
export const subtaskSchema = z.object({
  id: z.number().optional(),
  taskId: z.number(),                    // Foreign key
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less'),
  completed: z.boolean().default(false),
  order: z.number().optional(),          // Position within task
  createdAt: z.string(),                 // ISO 8601 timestamp
  updatedAt: z.string(),                 // ISO 8601 timestamp
});

export type Subtask = z.infer<typeof subtaskSchema>;

export const subtaskFormSchema = subtaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  order: true,
});

export type SubtaskFormData = z.infer<typeof subtaskFormSchema>;
```

**Updated Dexie Schema with Subtasks Store:**
```typescript
export interface Subtask {
  id?: number;
  taskId: number;                       // Foreign key
  title: string;
  completed: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export class AppDatabase extends Dexie {
  tasks!: Table<Task>;
  subtasks!: Table<Subtask>;            // NEW

  constructor() {
    super('freelancerAppDB');
    this.version(1).stores({
      tasks: '++id, columnId, priority, dueDate, order',
      subtasks: '++id, taskId, order',  // NEW: index on taskId and order
    });
  }
}
```

**AppContext State Update:**
```typescript
interface AppContextType {
  tasks: Task[];
  subtasks: Subtask[];                  // NEW
  columns: Column[];
  addTask: (columnId: number, data: TaskFormData) => Promise<Task>;
  // ... other task methods
  addSubtask: (taskId: number, title: string) => Promise<Subtask>;
  deleteSubtask: (subtaskId: number) => Promise<void>;
  toggleSubtaskCompletion: (subtaskId: number) => Promise<void>;
  updateSubtaskOrder: (subtaskId: number, newOrder: number) => Promise<void>;
}
```

**Quick-Add Field Props:**
```typescript
interface QuickAddFieldProps {
  columnId: number;
  onTaskCreated?: (task: Task) => void;
  onExpand?: () => void;                // Callback to expand to full form
  placeholder?: string;
  autoFocus?: boolean;
}
```

### References

- **Subtask Schema:** `src/schemas/subtask.ts` (new)
- **Dexie Relationships:** https://dexie.org/docs/Collection/Collection.toArray()
- **React Context Hook:** https://react.dev/reference/react/useContext
- **Zod Validation:** https://zod.dev/
- **Keyboard Shortcuts:** MDN Web Docs - Keyboard Events
- **ARIA Checkbox:** https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
- **Architecture Document:** `_bmad-output/planning-artifacts/architecture.md`
- **UX Design Spec:** `_bmad-output/planning-artifacts/ux-design-specification.md`
- **Previous Story 1.6:** `_bmad-output/implementation-artifacts/1-6-move-and-reorder-tasks-via-drag-and-drop.md`
- **Epics File:** `_bmad-output/planning-artifacts/epics.md` — Story 1.7 requirements (lines 275-290)

## Dev Implementation Guidance

### Epic 1 Sequence & Story 1.7 Position

**Story 1.7 of 7 in Epic 1:** Foundation & Core Kanban

**Sequence:**
- ✅ Story 1.1: Vite react-ts foundation (COMPLETE)
- ✅ Story 1.2: Tailwind, shadcn/ui, PWA, aliases (COMPLETE)
- ✅ Story 1.3: Dexie.js, React Router, Layout (COMPLETE)
- ✅ Story 1.4: Kanban board with customizable columns (COMPLETE)
- ✅ Story 1.5: Create and manage tasks with full fields (COMPLETE)
- ✅ Story 1.6: Move and reorder tasks via drag-and-drop (COMPLETE)
- **→ Story 1.7: Add subtasks and quick-add for tasks (THIS STORY - FINAL EPIC 1)**

**This story completes:** Epic 1 - Foundation & Core Kanban

### Step 1: Create Subtask Schema and Dexie Store

Create `src/schemas/subtask.ts`:

```typescript
import { z } from 'zod';

export const subtaskSchema = z.object({
  id: z.number().optional(),
  taskId: z.number(),                    // Foreign key to task
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less'),
  completed: z.boolean().default(false),
  order: z.number().optional(),          // Position within task subtasks
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Subtask = z.infer<typeof subtaskSchema>;

export const subtaskFormSchema = subtaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  order: true,
});

export type SubtaskFormData = z.infer<typeof subtaskFormSchema>;
```

Update `src/db/schema.ts`:

```typescript
import Dexie, { type Table } from 'dexie';

export interface Subtask {
  id?: number;
  taskId: number;
  title: string;
  completed: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export class AppDatabase extends Dexie {
  tasks!: Table<Task>;
  subtasks!: Table<Subtask>;  // NEW

  constructor() {
    super('freelancerAppDB');
    this.version(1).stores({
      tasks: '++id, columnId, priority, dueDate, order',
      subtasks: '++id, taskId, order', // NEW: indexes on taskId and order
    });
  }
}

export const db = new AppDatabase();
```

### Step 2: Add Subtask Methods to AppContext

Update `src/context/AppContext.tsx` to include:

```typescript
// State
const [subtasks, setSubtasks] = useState<Subtask[]>([]);

// Methods
const addSubtask = async (taskId: number, title: string): Promise<Subtask> => {
  try {
    const validData = subtaskFormSchema.parse({ taskId, title });
    
    // Calculate order: max existing order + 1
    const taskSubtasks = subtasks.filter(s => s.taskId === taskId);
    const newOrder = Math.max(...taskSubtasks.map(s => s.order ?? 0), -1) + 1;

    const now = new Date().toISOString();
    const subtaskData: Omit<Subtask, 'id'> = {
      ...validData,
      order: newOrder,
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.subtasks.add(subtaskData);
    const newSubtask: Subtask = { ...subtaskData, id };
    setSubtasks([...subtasks, newSubtask]);
    return newSubtask;
  } catch (err: any) {
    console.error('Failed to add subtask:', err);
    throw new Error(err.message || 'Failed to add subtask');
  }
};

const deleteSubtask = async (subtaskId: number): Promise<void> => {
  try {
    await db.subtasks.delete(subtaskId);
    setSubtasks(subtasks.filter(s => s.id !== subtaskId));
  } catch (err: any) {
    console.error('Failed to delete subtask:', err);
    throw new Error(err.message || 'Failed to delete subtask');
  }
};

const toggleSubtaskCompletion = async (subtaskId: number): Promise<void> => {
  try {
    const subtask = subtasks.find(s => s.id === subtaskId);
    if (!subtask) throw new Error('Subtask not found');

    const updatedSubtask = { ...subtask, completed: !subtask.completed, updatedAt: new Date().toISOString() };
    await db.subtasks.update(subtaskId, updatedSubtask);
    
    setSubtasks(subtasks.map(s => s.id === subtaskId ? updatedSubtask : s));
  } catch (err: any) {
    console.error('Failed to toggle subtask completion:', err);
    throw new Error(err.message || 'Failed to toggle subtask completion');
  }
};

const updateSubtaskOrder = async (subtaskId: number, newOrder: number): Promise<void> => {
  try {
    const now = new Date().toISOString();
    await db.subtasks.update(subtaskId, { order: newOrder, updatedAt: now });
    
    setSubtasks(subtasks.map(s => 
      s.id === subtaskId ? { ...s, order: newOrder, updatedAt: now } : s
    ));
  } catch (err: any) {
    console.error('Failed to update subtask order:', err);
    throw new Error(err.message || 'Failed to update subtask order');
  }
};
```

Load subtasks on app initialization:

```typescript
useEffect(() => {
  const loadSubtasks = async () => {
    try {
      const allSubtasks = await db.subtasks.toArray();
      setSubtasks(allSubtasks);
    } catch (err) {
      console.error('Failed to load subtasks:', err);
    }
  };

  loadSubtasks();
}, []);
```

### Step 3: Create SubtasksPanel Component

Create `src/components/SubtasksPanel.tsx`:

```typescript
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task } from '@/schemas/task';
import { Subtask } from '@/schemas/subtask';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';

interface SubtasksPanelProps {
  task: Task;
}

export default function SubtasksPanel({ task }: SubtasksPanelProps) {
  const { subtasks, addSubtask, deleteSubtask, toggleSubtaskCompletion } = useApp();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const taskSubtasks = subtasks
    .filter(s => s.taskId === task.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const completedCount = taskSubtasks.filter(s => s.completed).length;

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError(null);
      await addSubtask(task.id!, newSubtaskTitle);
      setNewSubtaskTitle('');
      setIsAdding(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add subtask');
    }
  };

  const handleDeleteSubtask = async (subtaskId: number) => {
    if (confirm('Delete this subtask?')) {
      try {
        setError(null);
        await deleteSubtask(subtaskId);
      } catch (err: any) {
        setError(err.message || 'Failed to delete subtask');
      }
    }
  };

  const handleToggle = async (subtaskId: number) => {
    try {
      setError(null);
      await toggleSubtaskCompletion(subtaskId);
    } catch (err: any) {
      setError(err.message || 'Failed to update subtask');
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">
          Subtasks ({completedCount}/{taskSubtasks.length})
        </h3>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {taskSubtasks.length === 0 && !isAdding && (
        <div className="text-center py-3">
          <p className="text-gray-500 text-sm mb-2">No subtasks yet</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add subtask
          </Button>
        </div>
      )}

      <div className="space-y-2 mb-3">
        {taskSubtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2">
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={() => handleToggle(subtask.id!)}
              aria-label={`Toggle completion for: ${subtask.title}`}
            />
            <span
              className={`flex-1 text-sm ${
                subtask.completed
                  ? 'line-through text-gray-400'
                  : 'text-gray-900'
              }`}
            >
              {subtask.title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteSubtask(subtask.id!)}
              aria-label={`Delete subtask: ${subtask.title}`}
              className="h-7 w-7 p-0"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-3">
          <Input
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSubtask();
              if (e.key === 'Escape') {
                setNewSubtaskTitle('');
                setIsAdding(false);
              }
            }}
            placeholder="Subtask title..."
            maxLength={255}
            autoFocus
            className="flex-1"
          />
          <Button size="sm" onClick={handleAddSubtask}>
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNewSubtaskTitle('');
              setIsAdding(false);
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {!isAdding && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add subtask
        </Button>
      )}
    </div>
  );
}
```

### Step 4: Create QuickAddField Component

Create `src/components/QuickAddField.tsx`:

```typescript
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { TaskFormData } from '@/schemas/task';

interface QuickAddFieldProps {
  columnId: number;
  onTaskCreated?: () => void;
}

export default function QuickAddField({
  columnId,
  onTaskCreated,
}: QuickAddFieldProps) {
  const { addTask } = useApp();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!value.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const taskData: TaskFormData = {
        title: value,
        columnId,
        priority: 'Medium',
        completed: false,
      };

      await addTask(columnId, taskData);
      setValue('');
      onTaskCreated?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === 'Escape') {
      setValue('');
      setError(null);
    }
  };

  return (
    <div className="mt-2">
      {error && (
        <div className="mb-2 p-2 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      <Input
        type="text"
        placeholder="Add a task..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        maxLength={255}
        className="w-full"
      />
      <div className="text-xs text-gray-500 mt-1">
        Press Enter to add, Escape to cancel
      </div>
    </div>
  );
}
```

### Step 5: Create TaskSummary Component

Create `src/components/TaskSummary.tsx`:

```typescript
import { useApp } from '@/context/AppContext';
import { Task } from '@/schemas/task';

interface TaskSummaryProps {
  task: Task;
}

export default function TaskSummary({ task }: TaskSummaryProps) {
  const { subtasks } = useApp();

  const taskSubtasks = subtasks.filter(s => s.taskId === task.id);
  if (taskSubtasks.length === 0) return null;

  const completedCount = taskSubtasks.filter(s => s.completed).length;

  return (
    <div className="text-xs text-gray-500 mt-1">
      {completedCount}/{taskSubtasks.length} subtasks
    </div>
  );
}
```

### Step 6: Integrate QuickAddField into SortableColumn

Update `src/components/SortableColumn.tsx` to include quick-add:

```typescript
import QuickAddField from './QuickAddField';

export default function SortableColumn({
  column,
  tasks,
  onTaskUpdated,
}: SortableColumnProps) {
  // ... existing code ...

  return (
    <div ref={setNodeRef} className={/* ... */}>
      <SortableContext items={sortedTasks.map(t => t.id!)}>
        {/* existing tasks rendering */}
        {sortedTasks.map((task) => (
          <DraggableTaskCard key={task.id} task={task} onTaskUpdated={onTaskUpdated} />
        ))}
      </SortableContext>

      <QuickAddField columnId={column.id!} onTaskCreated={onTaskUpdated} />
    </div>
  );
}
```

### Step 7: Add Keyboard Shortcut for Quick-Add

Create `src/hooks/useKeyboardShortcut.ts`:

```typescript
import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; shift?: boolean; cmd?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      const matches =
        e.key.toUpperCase() === key.toUpperCase() &&
        (options.ctrl ? e.ctrlKey : !e.ctrlKey) &&
        (options.cmd ? cmdKey : !cmdKey) &&
        (options.shift ? e.shiftKey : !e.shiftKey);

      if (matches) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options]);
}
```

### Step 8: Integrate SubtasksPanel into TaskDetailPanel

Update your task detail panel/sheet component:

```typescript
import SubtasksPanel from './SubtasksPanel';

export default function TaskDetailPanel({ task, open, onOpenChange }: /* props */) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {/* existing task fields */}
        <SubtasksPanel task={task} />
      </SheetContent>
    </Sheet>
  );
}
```

### Step 9: Update TaskCard to Show Subtask Summary

Update `src/components/TaskCard.tsx`:

```typescript
import TaskSummary from './TaskSummary';

export default function TaskCard({ task }: /* props */) {
  return (
    <div className={/* card classes */}>
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <TaskSummary task={task} />
      {/* other task fields */}
    </div>
  );
}
```

### Step 10: Test All Acceptance Criteria

**Test checklist:**
1. ✅ Create subtask, verify it appears and persists
2. ✅ Mark subtask complete, verify checkbox and summary update
3. ✅ Delete subtask, verify confirmation and deletion
4. ✅ Quick-add task with just title, verify created
5. ✅ Quick-add in different columns, verify in correct columns
6. ✅ Keyboard shortcut creates quick-add field
7. ✅ Validation: empty title shows error
8. ✅ Validation: title > 255 chars truncated or error
9. ✅ Performance: create 100 tasks, measure time < 200ms
10. ✅ Accessibility: Tab through subtasks, keyboard shortcut works
11. ✅ Persistence: refresh page, verify subtasks retained
12. ✅ No console errors

## Previous Story Intelligence (Story 1.6)

**Key Learnings from Story 1.6:**
- ✅ Drag-and-drop is fully functional with @dnd-kit
- ✅ Task order field and Dexie indexing work well
- ✅ AppContext pattern handles state mutations safely
- ✅ @dnd-kit supports keyboard navigation seamlessly

**What Works in Story 1.6:**
- Drag-and-drop between columns and within columns
- Task order persistence
- Keyboard and touch support
- Error recovery and rollback
- Performance with 100+ tasks

**Apply These Patterns in Story 1.7:**
- Use AppContext methods to manage state changes
- Keep Dexie queries efficient with proper indexes
- Handle errors with try/catch and user messages
- Maintain immutable state updates
- Test with large datasets (100+ tasks/subtasks)

## Git Commit History Context

Recent commits (Stories 1.1-1.6):
```
baa33e5 feat(story-1.6): Create comprehensive story for move and reorder tasks via drag-and-drop
cdafd46 feat(story-1.5): Create and manage tasks with full fields - comprehensive developer guide
9a2e42c feat(story-1.4): Create comprehensive story for kanban board with customizable columns
b28b3af feat(story-1.3): Create comprehensive story for Dexie.js, React Router, and base Layout
94a2547 feat(story-1.2): Create comprehensive story for Tailwind, shadcn/ui, PWA, and path aliases
d6078bb docs(story-1.1): Update documentation to match implementation
```

**Commit Pattern:** `feat(story-X.Y): {description}`

**Commit for Story 1.7:**
```bash
git add -A
git commit -m "feat(story-1.7): Add subtasks and quick-add for tasks"
```

### Implementation Timeline Estimate

- **Create Subtask schema and Dexie store:** 10 minutes
- **Add subtask methods to AppContext:** 15 minutes
- **Create SubtasksPanel component:** 20 minutes
- **Create QuickAddField component:** 15 minutes
- **Create TaskSummary component:** 5 minutes
- **Integrate QuickAddField into columns:** 10 minutes
- **Implement keyboard shortcut:** 10 minutes
- **Integrate SubtasksPanel into detail panel:** 10 minutes
- **Update TaskCard with subtask summary:** 5 minutes
- **Testing and verification:** 40 minutes
- **Accessibility testing:** 15 minutes
- **Performance optimization:** 10 minutes
- **Git commit and finalization:** 5 minutes
- **Total:** ~165 minutes

### Critical Success Signals

✅ **Must Verify:**
1. Create subtask, verify persists
2. Mark subtask complete, verify checkbox state persists
3. Delete subtask, verify confirmation and deletion
4. Quick-add creates task with just title
5. Keyboard shortcut focuses quick-add field
6. Subtask summary displays on task card
7. Subtask count updates when adding/deleting
8. Empty title validation works
9. Performance: create 100 tasks in < 200ms each
10. Refresh page, verify all subtasks and their state retained
11. Keyboard: Tab through subtasks, use shortcut to create
12. Screen reader announces subtask completion state
13. No console errors
14. TypeScript compiles without errors
15. Dev server starts: `npm run dev`
16. Production build completes: `npm run build`
17. All changes committed to git
18. Ready for Epic 2 (Time Tracking)

---

## Acceptance Criteria Mapping

| AC # | Requirement | How to Verify |
|------|-------------|---------------|
| 1 | Create subtasks for tasks | Add subtask via detail panel, verify in Dexie |
| 2 | Display subtask summary on cards | Check task card shows "X/Y subtasks done" |
| 3 | Quick-add with title only | Type title in quick-add, press Enter, verify created |
| 4 | Expand quick-add to full fields | Click expand, edit full form, verify all fields save |
| 5 | Keyboard shortcut for quick-add | Press Cmd+Shift+N / Ctrl+Shift+N, verify field active |
| 6 | Quick-add column selection | Quick-add in different columns, verify tasks created in correct columns |
| 7 | Subtask order persistence | Reorder subtasks, refresh, verify order retained |
| 8 | Delete subtasks with confirmation | Delete, confirm, verify subtask removed and order intact |
| 9 | Subtask completion state | Toggle checkbox, verify strikethrough and summary update |
| 10 | Quick-add focus/blur behavior | Focus field, type, blur, verify cleared and no unsaved warning |
| 11 | Performance (< 200ms per task) | Create 100 tasks quickly, measure time with DevTools |
| 12 | Validation (required, max 255) | Try empty title, try > 255 chars, verify error messages |

---

## Known Constraints & Gotchas

1. **Subtask Order Consistency**
   - Always query subtasks sorted by order: `subtasks.filter(s => s.taskId === taskId).sort((a,b) => (a.order??0) - (b.order??0))`
   - Index order field in Dexie for efficient queries

2. **Foreign Key Management**
   - When task is deleted, cascade-delete subtasks (or show warning)
   - When querying tasks, load associated subtasks separately

3. **Quick-Add State Management**
   - Keep quick-add field focused after task creation (optional UX improvement)
   - Clear field on blur if empty, warn if unsaved content

4. **Keyboard Shortcut Conflicts**
   - Cmd+Shift+N might conflict with some browser shortcuts
   - Test across browsers (Chrome, Firefox, Safari)
   - Provide visual indicator when shortcut is active

5. **Performance Optimization**
   - Index subtasks by taskId and order for efficient queries
   - Consider lazy-loading subtasks for tasks not in viewport
   - Measure performance with 1000+ tasks and 10000+ subtasks

---

## Success Criteria

This story is **complete** when:

1. ✅ Subtask schema and Dexie store created
2. ✅ AppContext has addSubtask, deleteSubtask, toggleSubtaskCompletion, updateSubtaskOrder methods
3. ✅ SubtasksPanel displays subtasks with checkbox for completion
4. ✅ TaskSummary shows subtask count on task cards
5. ✅ QuickAddField allows creating task with just title
6. ✅ Quick-add keyboard shortcut (Cmd+Shift+N / Ctrl+Shift+N) works
7. ✅ Quick-add field integrated in each column
8. ✅ SubtasksPanel integrated in task detail panel
9. ✅ Subtask completion state persists
10. ✅ Subtask order persists across refresh
11. ✅ Quick-add creates task in < 200ms
12. ✅ Validation messages shown for empty/long titles
13. ✅ Accessibility: keyboard navigation works for subtasks and quick-add
14. ✅ Screen reader announces subtask completion and counts
15. ✅ Subtask deletion with confirmation
16. ✅ No console errors
17. ✅ TypeScript compiles without errors
18. ✅ Dev server runs: `npm run dev`
19. ✅ Production build completes: `npm run build`
20. ✅ All changes committed: `feat(story-1.7): Add subtasks and quick-add for tasks`
21. ✅ Ready for Epic 1 Retrospective (optional)
22. ✅ Ready for Epic 2 (Time Tracking)

---

**Status:** ready-for-dev

**Prepared by:** Ultimate Story Context Engine  
**Analysis Completed:** 2026-03-11  
**Story ID:** 1.7  
**Epic:** 1 - Foundation & Core Kanban  
**Estimated Effort:** 160-170 minutes  
**Story Sequence:** 7 of 7 in Epic 1 (FINAL EPIC 1 STORY)  
**Blocks:** Epic 2 - Time Tracking  
**Blocked By:** Story 1.6 (COMPLETE)

**Developer Instructions:**
1. Read this entire story document
2. Create Subtask schema (Zod) and add to Dexie
3. Add subtask methods to AppContext
4. Create SubtasksPanel component
5. Create QuickAddField component
6. Create TaskSummary component
7. Integrate QuickAddField into SortableColumn
8. Integrate SubtasksPanel into TaskDetailPanel
9. Update TaskCard with TaskSummary
10. Implement keyboard shortcut for quick-add
11. Test all acceptance criteria
12. Verify accessibility (keyboard, screen reader)
13. Test performance (100+ tasks)
14. Commit all changes to git
15. Mark Epic 1 as complete (optional)
16. Proceed to Epic 2 - Time Tracking or Epic 1 Retrospective
