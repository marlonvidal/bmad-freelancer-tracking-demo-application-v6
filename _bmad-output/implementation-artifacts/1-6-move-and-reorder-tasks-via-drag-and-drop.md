# Story 1.6: Move and Reorder Tasks via Drag-and-Drop

**Status:** in-progress

**Story ID:** 1.6 | **Epic:** 1 - Foundation & Core Kanban | **Sequence:** 6 of 7

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a freelancer,
I want to move tasks between columns and reorder them within a column via drag-and-drop,
So that I can manage my workflow visually without extra clicks.

## Acceptance Criteria

### AC 1: Drag Task Between Columns
**Given** tasks in columns from Story 1.5
**When** I click and drag a task to another column
**Then** the task moves to the target column and persists (FR5)
**And** the drop target column is visually highlighted during drag
**And** a drop indicator shows where the task will land
**And** the task appears in the correct position in the target column
**And** changes auto-save to Dexie immediately

### AC 2: Reorder Tasks Within a Column
**Given** multiple tasks in a column
**When** I drag a task up or down within the same column
**Then** the task reorders within that column (FR6)
**And** the reordered position persists to Dexie
**And** a drop indicator shows insertion point during drag
**And** drop position is accurate and responsive

### AC 3: Drag-and-Drop Visual Feedback
**Given** a task being dragged
**When** I hover over a valid drop target
**Then** the drop target is highlighted or shows a visual indicator
**And** invalid drop targets show no highlight
**And** drag opacity/transform provides visual feedback (not full opacity change, subtle)
**And** animations maintain 60fps (NFR2)
**And** `prefers-reduced-motion` is respected (no animation if set)

### AC 4: Keyboard Support for Drag-and-Drop
**Given** the task list from Story 1.5
**When** I use keyboard (arrow keys, Enter, Space) to move tasks
**Then** I can select a task via keyboard
**And** I can move it to adjacent or target column via keyboard commands (per @dnd-kit)
**And** actions are announced to screen readers
**And** focus management is clear and predictable (NFR9)

### AC 5: Touch Support
**Given** a touchscreen device
**When** I perform drag-and-drop on touch
**Then** drag-and-drop works smoothly (per @dnd-kit touch handling)
**And** long-press initiates drag on touch devices
**And** visual feedback is clear during touch drag
**And** drop is precise and responsive

### AC 6: Undo/Error Recovery
**Given** a task is moved or reordered
**If** Dexie save fails
**Then** the task reverts to previous position visually
**And** user sees actionable error message: "Failed to move task. Please try again."
**And** no silent failures

### AC 7: Performance with Multiple Tasks
**Given** the kanban board with multiple tasks
**When** I drag and drop tasks
**Then** animations remain smooth at 60fps (NFR2)
**And** large datasets (100+ tasks) don't cause lag
**And** reordering is responsive and immediate

### AC 8: Data Integrity
**Given** tasks are reordered or moved
**When** I refresh the page
**Then** tasks remain in the new position and column
**And** task IDs and data are preserved
**And** no data loss or corruption occurs

## Tasks / Subtasks

- [ ] Update Task schema to include order field (AC 2, 8)
  - [ ] Add `order?: number` field to Task schema in `src/schemas/task.ts`
  - [ ] Ensure Dexie `tasks` store indexes `order` field
  - [ ] Migrate existing tasks: assign order based on creation order

- [ ] Set up @dnd-kit integration (AC 1, 4, 5)
  - [ ] Verify @dnd-kit is installed from Story 1.2
  - [ ] Create draggable context wrapper component
  - [ ] Import necessary @dnd-kit hooks: useSortable, SortableContext, DndContext
  - [ ] Configure DndContext with collision detection, sensors (keyboard, pointer, touch)

- [ ] Create DraggableTaskCard component (AC 1, 2, 3)
  - [ ] Wrap TaskCard with @dnd-kit useSortable hook
  - [ ] Apply transform and opacity for drag feedback
  - [ ] Show isDragging state visually (e.g., reduced opacity, shadow)
  - [ ] Add aria-label for keyboard users

- [ ] Create SortableColumn component (AC 1, 2, 3)
  - [ ] Wrap column content with SortableContext
  - [ ] Create droppable zone for tasks
  - [ ] Apply visual feedback on over state (highlight, border, background color)
  - [ ] Use AnimateLayoutChanges plugin if needed for smooth reorder animation

- [ ] Implement task move logic (AC 1, 2)
  - [ ] Create `moveTask(taskId, targetColumnId, newOrder)` in AppContext
  - [ ] Handle within-column reorder (same column, different order)
  - [ ] Handle cross-column move (different column, auto-order)
  - [ ] Update Dexie: save columnId and order fields
  - [ ] Update AppContext state immutably

- [ ] Handle drag-and-drop events (AC 1, 2, 3)
  - [ ] Implement onDragEnd handler in DndContext
  - [ ] Detect if task moved to new column or reordered in same column
  - [ ] Call moveTask with correct parameters
  - [ ] Handle no-op moves (drop in same position)

- [ ] Add error recovery and visual feedback (AC 3, 6)
  - [ ] Wrap moveTask in try/catch
  - [ ] Show error toast/message if move fails
  - [ ] Revert task position visually on error
  - [ ] Log error to console (dev only)
  - [ ] Show user-friendly message: "Failed to move task. Please try again."

- [ ] Implement accessibility for keyboard and screen readers (AC 4, 8)
  - [ ] Configure @dnd-kit keyboard sensor for arrow key navigation
  - [ ] Add aria-pressed and aria-describedby attributes
  - [ ] Test with screen reader: NVDA or VoiceOver
  - [ ] Ensure drop confirmation is announced
  - [ ] Test keyboard-only workflow: Tab to task, Space to select, Arrows to move, Enter to confirm

- [ ] Optimize performance (AC 7)
  - [ ] Use React.memo for TaskCard if rerenders are excessive
  - [ ] Verify no unnecessary re-renders during drag
  - [ ] Test with 100+ tasks in a column
  - [ ] Measure FPS during drag-and-drop (Chrome DevTools)
  - [ ] Ensure smooth 60fps animations

- [ ] Handle prefers-reduced-motion (AC 3)
  - [ ] Detect prefers-reduced-motion in CSS or JS
  - [ ] Disable animations if user prefers reduced motion
  - [ ] Keep drag-and-drop functional (just no animation)
  - [ ] Test with `prefers-reduced-motion: reduce` in browser settings

- [ ] Update Dexie schema and migrations (AC 1, 8)
  - [ ] Add `order` index to `tasks` store definition
  - [ ] Query tasks sorted by order: `db.tasks.where('columnId').equals(columnId).toArray()` then sort by order
  - [ ] Verify no data loss during migration
  - [ ] Test with existing data from Story 1.5

- [ ] Update KanbanBoard to use SortableColumn (AC 1, 2, 3)
  - [ ] Wrap KanbanBoard with DndContext
  - [ ] Replace ColumnContent with SortableColumn
  - [ ] Pass DndContext config (collision detection, sensors)
  - [ ] Wire onDragEnd to moveTask

- [ ] Test all acceptance criteria (AC 1-8)
  - [ ] Move task between columns: drag from column A to B, verify persists
  - [ ] Reorder tasks in same column: drag up/down, verify order persists
  - [ ] Verify drop target highlighting during drag
  - [ ] Verify drop indicator shows insertion point
  - [ ] Test keyboard: Tab to task, arrow keys to move, Enter to drop
  - [ ] Test touch: long-press and drag on mobile device
  - [ ] Test error recovery: simulate Dexie failure, verify rollback
  - [ ] Test performance: drag with 100+ tasks, measure FPS
  - [ ] Test accessibility: screen reader announces moves, focus is clear
  - [ ] Test prefers-reduced-motion: disable animations, verify still functional
  - [ ] Test with page refresh: verify tasks remain in new positions
  - [ ] Verify no console errors or warnings

## Dev Agent Record

### Implementation Plan (AI)

**Date:** 2026-03-12  
**Agent:** Claude Assistant  
**Approach:** Red-Green-Refactor (TDD)

**Implementation Summary:**

**Phase 1: Schema & Context Updates (COMPLETE)**
- ✅ Added `order?: number` field to TaskSchema (validation.ts)
- ✅ Added `order?: number` field to Task interface (schema.ts)
- ✅ Updated Dexie tasks store index to include order field
- ✅ Added task order migration logic on app startup to handle existing tasks
- ✅ Updated createTask method to assign order based on column max order
- ✅ Added moveTask method to AppContext for cross-column and within-column reordering

**Phase 2: Component Creation (COMPLETE)**
- ✅ Created `src/hooks/useReducedMotion.ts` - Detects prefers-reduced-motion preference
- ✅ Created `src/components/DraggableTaskCard.tsx` - Wraps TaskCard with @dnd-kit useSortable
  - Applies opacity feedback during drag (0.5 opacity when dragging)
  - Respects prefers-reduced-motion for animations
  - Includes aria-label and aria-pressed for accessibility
  - data-testid for test identification
  
- ✅ Created `src/components/SortableColumn.tsx` - Drop zone for tasks within column
  - Wraps tasks in SortableContext with vertical strategy
  - Shows visual feedback on drop zone (blue highlight when isOver=true)
  - Sorts tasks by order field
  - Renders empty state with add task button

**Phase 3: Integration Updates (COMPLETE)**
- ✅ Updated `src/components/ColumnHeader.tsx`
  - Added nested DndContext for task drag-and-drop
  - Integrated SortableColumn component
  - Handles task drag-end events and calls moveTask
  
- ✅ Updated `src/components/KanbanBoard.tsx`
  - Enhanced to handle both column reordering and task moving
  - Added PointerSensor in addition to Mouse/Touch/Keyboard sensors
  - Added error state UI for failed task moves
  - Distinguishes between task drag and column drag in handleDragEnd
  
- ✅ Updated `src/components/ColumnContent.tsx`
  - Added sorting by order field: `sort((a, b) => (a.order ?? 0) - (b.order ?? 0))`

- ✅ Updated `src/context/AppContext.tsx`
  - Enhanced initialization to migrate existing tasks with order values
  - Groups tasks by column and assigns order by creation date
  - Added moveTask method with support for:
    - Cross-column moves (updates columnId and order, shifts other tasks)
    - Within-column reordering (shifts affected tasks up/down)
    - Error handling with try/catch and user-friendly messages

**Testing Status:**
- E2E tests running (currently executing across Chromium, Firefox, WebKit, Mobile Chrome)
- Component tests available at: tests/component/drag-and-drop.spec.ts
- E2E tests available at: tests/e2e/drag-and-drop.spec.ts

### Known Limitations & Notes

1. **Nested DndContexts**: Using separate DndContexts for columns (horizontal) and tasks (vertical) within each column to support simultaneous column reordering and task drag-and-drop

2. **Order Assignment Logic**: 
   - New tasks get order = max(existing orders) + 1
   - Existing tasks without order are migrated on app startup
   - Order values are integers starting from 0

3. **Error Recovery**: Task moves are wrapped in try/catch; on failure, error message is shown and tasks are reloaded from Dexie to maintain consistency

4. **Performance**: Using sortable key IDs strategy with vertical list strategy for smooth animations

### Files Modified

- ✅ src/db/validation.ts - Added order field to TaskSchema
- ✅ src/db/schema.ts - Added order field to Task interface, updated Dexie index
- ✅ src/context/AppContext.tsx - Added moveTask method, migration logic
- ✅ src/components/KanbanBoard.tsx - Enhanced with task move handling
- ✅ src/components/ColumnHeader.tsx - Added nested DndContext and SortableColumn
- ✅ src/components/ColumnContent.tsx - Sort tasks by order field

### Files Created

- ✅ src/hooks/useReducedMotion.ts - Accessibility hook for motion preferences
- ✅ src/components/DraggableTaskCard.tsx - @dnd-kit wrapped task card
- ✅ src/components/SortableColumn.tsx - Column drop zone component

### Build Status

- ✅ TypeScript compilation: SUCCESS
- ✅ Vite build: SUCCESS (dist output generated)
- ✅ No console errors or warnings on build
- ✅ Dev server: RUNNING

## Dev Notes (Updated)

### Relevant Architecture Patterns and Constraints

**From Architecture:**
- **Drag-and-Drop Library:** Use @dnd-kit for kanban (accessibility, keyboard, touch)
- **Collision Detection:** Use @dnd-kit collision detection (e.g., `closestCenter` or `pointerWithin`)
- **Keyboard Support:** @dnd-kit keyboard sensor for arrow keys, Enter to drop
- **Performance:** Animations must maintain 60fps (NFR2)
- **Touch Support:** @dnd-kit handles pointer and touch sensors automatically
- **State Management:** React Context (AppContext) for task reordering; sync to Dexie on every move
- **Data Persistence:** Single Dexie write per move; update `columnId` and `order` fields
- **Error Handling:** Catch failures, show user message, revert on error

**From UX Design:**
- **Drop Target Highlight:** Visual highlight (color, border, or shadow) when hovering over valid drop zone
- **Drag Opacity:** Subtle opacity reduction during drag (not too aggressive, still visible)
- **Drop Indicator:** Line or shadow showing insertion point during drag
- **Animations:** Smooth reorder animation (70ms-150ms) respecting `prefers-reduced-motion`
- **Touch Targets:** Drag handle or full card is draggable (full card is easier on mobile)
- **Accessibility:** Screen reader announces "Task moved to [column name]", focus returns to task

**From Epic 1 Sequence & Dependencies:**
- **Story 1.6 unblocks:** Story 1.7 (subtasks and quick-add depend on stable drag-and-drop)
- **Depends on:** Story 1.5 (tasks with full fields must exist)
- **Cross-Epic Context:** Epic 2 will add detail panel; ensure drag-and-drop works with panel closed

### Source Tree Components to Touch

**New files to create:**
- `src/components/DraggableTaskCard.tsx` — Task card wrapped with @dnd-kit useSortable
- `src/components/SortableColumn.tsx` — Column with SortableContext for tasks
- `src/components/KanbanBoardWithDnd.tsx` (or update existing KanbanBoard.tsx)
- `src/hooks/useTaskDragDrop.ts` (optional) — Custom hook for drag-and-drop logic

**Modified files:**
- `src/context/AppContext.tsx` — Add moveTask(taskId, targetColumnId, newOrder) method
- `src/components/KanbanBoard.tsx` — Wrap with DndContext, use SortableColumn
- `src/schemas/task.ts` — Add optional `order` field
- `src/db/schema.ts` — Add `order` index to tasks store
- `src/components/ColumnContent.tsx` — Update to sort tasks by order

**Expected file structure after Story 1.6:**
```
src/
├── components/
│   ├── ui/                          # shadcn
│   ├── KanbanBoard.tsx              # MODIFIED: wrap with DndContext
│   ├── DraggableTaskCard.tsx        # NEW: TaskCard with useSortable
│   ├── SortableColumn.tsx           # NEW: Column with SortableContext
│   ├── ColumnHeader.tsx             # From 1.4 (unchanged)
│   ├── ColumnContent.tsx            # MODIFIED: render sorted tasks
│   ├── TaskCard.tsx                 # From 1.5 (may wrap with DraggableTaskCard)
│   ├── TaskForm.tsx                 # From 1.5 (unchanged)
├── schemas/
│   ├── column.ts                    # From 1.4 (unchanged)
│   ├── task.ts                      # MODIFIED: add order field
├── context/
│   └── AppContext.tsx               # MODIFIED: add moveTask method
├── db/
│   ├── schema.ts                    # MODIFIED: add order index
│   └── index.ts                     # From 1.3 (unchanged)
├── hooks/
│   └── useTaskDragDrop.ts           # NEW (optional): drag-drop logic
└── ...
```

### Testing Standards Summary

**Manual verification tests:**
1. **Drag Between Columns:** Drag task from column A to B, verify it appears in B and persists
2. **Reorder Within Column:** Drag task up/down in same column, verify order persists
3. **Visual Feedback:** During drag, verify drop target highlights and drop indicator shows
4. **Keyboard:** Tab to task, arrow keys to move, Enter to drop, verify works
5. **Touch:** Long-press and drag on mobile/tablet, verify smooth and responsive
6. **Error Recovery:** Simulate Dexie error, verify task reverts and error shown
7. **Performance:** Drag with 100+ tasks, measure FPS with Chrome DevTools (target 60fps)
8. **Accessibility:** Screen reader announces "Task moved to [column]", focus managed properly
9. **Prefers Reduced Motion:** Enable in browser settings, verify animations disabled but drag works
10. **Persistence:** Move task, refresh page, verify new position retained
11. **No Cross-Contamination:** Move task from column A to B to C, verify order correct in each
12. **TypeScript:** `npm run build` produces no errors
13. **Dev Server:** `npm run dev` starts without errors

### Project Structure Notes

**Before (Story 1.5):**
- TaskCard renders but is not draggable
- ColumnContent displays tasks in creation order
- No @dnd-kit integration

**After (Story 1.6):**
- TaskCard wrapped with @dnd-kit useSortable (DraggableTaskCard)
- Tasks render in order from Dexie (order field)
- Columns have SortableContext for drop zones
- KanbanBoard wrapped with DndContext
- Drag-and-drop fully functional with keyboard, touch, screen reader support
- Task move persists to Dexie immediately

### Key Data Structures

**Updated Task Schema (Zod) with order field:**
```typescript
{
  id?: number;                        // Auto-generated by Dexie
  title: string;                      // Required, max 255 chars
  description?: string;               // Optional, max 2000 chars
  columnId: number;                   // Required, foreign key
  priority: "Low" | "Medium" | "High" | "Urgent";
  tags?: string[];                    // Optional, array of tag strings
  dueDate?: string;                   // Optional, ISO 8601 date string
  order?: number;                     // NEW: position within column (0, 1, 2, ...)
  completed: boolean;                 // Default: false
  createdAt: string;                  // ISO 8601 timestamp
  updatedAt: string;                  // ISO 8601 timestamp
}
```

**Dexie `tasks` Store Definition with order index:**
```javascript
tasks: '++id, columnId, priority, dueDate, order' // Added order index
```

**@dnd-kit Configuration Example:**
```typescript
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Sort, verticalListSortingStrategy } from '@dnd-kit/sortable';

const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(TouchSensor),
  useSensor(KeyboardSensor)
);

<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  {/* columns */}
</DndContext>
```

### References

- **@dnd-kit Documentation:** https://docs.dnd-kit.com/ — For drag-and-drop implementation
- **@dnd-kit Sortable Plugin:** https://docs.dnd-kit.com/api-documentation/sortable — For sortable lists
- **@dnd-kit Accessibility:** https://docs.dnd-kit.com/api-documentation/utilities/accessibility — Keyboard and screen reader support
- **React Context Hook:** https://react.dev/reference/react/useContext
- **Dexie.js Sorting:** https://dexie.org/docs/Collection/Collection.offset() — For ordering queries
- **WCAG 2.1 AA Drag-and-Drop:** https://www.w3.org/WAI/ARIA/apg/patterns/dragdrop/ — Accessibility patterns
- **prefers-reduced-motion:** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- **Architecture Document:** `_bmad-output/planning-artifacts/architecture.md`
- **UX Design Spec:** `_bmad-output/planning-artifacts/ux-design-specification.md`
- **Previous Story 1.5:** `_bmad-output/implementation-artifacts/1-5-create-and-manage-tasks-with-full-fields.md`
- **Epics File:** `_bmad-output/planning-artifacts/epics.md` — Story 1.6 requirements (lines 258-274)

## Dev Implementation Guidance

### Epic 1 Sequence & Story 1.6 Position

**Story 1.6 of 7 in Epic 1:** Foundation & Core Kanban

**Sequence:**
- ✅ Story 1.1: Vite react-ts foundation (COMPLETE)
- ✅ Story 1.2: Tailwind, shadcn/ui, PWA, aliases (COMPLETE)
- ✅ Story 1.3: Dexie.js, React Router, Layout (COMPLETE)
- ✅ Story 1.4: Kanban board with customizable columns (COMPLETE, review status)
- ✅ Story 1.5: Create and manage tasks with full fields (COMPLETE, ready-for-dev)
- **→ Story 1.6: Move and reorder tasks via drag-and-drop (THIS STORY)**
- Story 1.7: Add subtasks and quick-add for tasks

**This story unblocks:** Story 1.7 (depends on working drag-and-drop)

### Step 1: Update Task Schema with Order Field

Update `src/schemas/task.ts`:

```typescript
import { z } from 'zod';

export const prioritySchema = z.enum(['Low', 'Medium', 'High', 'Urgent']);
export type Priority = z.infer<typeof prioritySchema>;

export const taskSchema = z.object({
  id: z.number().optional(),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less'),
  description: z.string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional()
    .or(z.literal('')),
  columnId: z.number(),
  priority: prioritySchema.default('Medium'),
  tags: z.array(z.string()).optional().default([]),
  dueDate: z.string().optional().or(z.literal('')),
  order: z.number().optional(), // NEW: position within column
  completed: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const taskFormSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completed: true,
  order: true, // NEW: order is managed by drag-and-drop, not form
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
```

### Step 2: Update Dexie Schema with Order Index

Update `src/db/schema.ts`:

```typescript
import Dexie, { type Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  columnId: number;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  tags?: string[];
  dueDate?: string;
  order?: number; // NEW: position within column
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class AppDatabase extends Dexie {
  tasks!: Table<Task>;
  // ... other tables

  constructor() {
    super('freelancerAppDB');
    this.version(1).stores({
      tasks: '++id, columnId, priority, dueDate, order', // Added order index
      // ... other stores
    });
  }
}

export const db = new AppDatabase();

// Migration: assign order to existing tasks by creation date
export async function migrateTaskOrder() {
  const tasks = await db.tasks.toArray();
  
  // Group tasks by columnId
  const tasksByColumn = tasks.reduce((acc: Record<number, Task[]>, task) => {
    if (!acc[task.columnId]) acc[task.columnId] = [];
    acc[task.columnId].push(task);
    return acc;
  }, {});

  // Assign order within each column
  for (const [columnId, columnTasks] of Object.entries(tasksByColumn)) {
    columnTasks.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    for (let i = 0; i < columnTasks.length; i++) {
      await db.tasks.update(columnTasks[i].id!, { order: i });
    }
  }
}

// Call on app startup: await migrateTaskOrder();
```

### Step 3: Create DraggableTaskCard Component

Create `src/components/DraggableTaskCard.tsx`:

```typescript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import { Task } from '@/schemas/task';

interface DraggableTaskCardProps {
  task: Task;
  onTaskUpdated?: () => void;
}

export default function DraggableTaskCard({
  task,
  onTaskUpdated,
}: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-50' : ''}
    >
      <TaskCard task={task} onTaskUpdated={onTaskUpdated} />
    </div>
  );
}
```

### Step 4: Create SortableColumn Component

Create `src/components/SortableColumn.tsx`:

```typescript
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from '@/db';
import { Task } from '@/schemas/task';
import DraggableTaskCard from './DraggableTaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskForm from './TaskForm';
import { useState } from 'react';

interface SortableColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask?: (columnId: number) => void;
  onTaskUpdated?: () => void;
}

export default function SortableColumn({
  column,
  tasks,
  onAddTask,
  onTaskUpdated,
}: SortableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const sortedTasks = [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 bg-gray-50 rounded-lg p-6 min-h-96 transition-colors ${
        isOver ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-transparent'
      }`}
    >
      <SortableContext
        items={sortedTasks.map(t => t.id!)}
        strategy={verticalListSortingStrategy}
      >
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <p className="text-sm mb-3">No tasks yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddTaskOpen(true)}
              aria-label={`Add task to ${column.name}`}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add task
            </Button>
          </div>
        ) : (
          <div>
            {sortedTasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onTaskUpdated={onTaskUpdated}
              />
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddTaskOpen(true)}
              className="w-full justify-start text-gray-500 hover:text-gray-700 mt-2"
              aria-label={`Add another task to ${column.name}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add task
            </Button>
          </div>
        )}
      </SortableContext>

      <TaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        columnId={column.id!}
        onTaskSaved={() => {
          setIsAddTaskOpen(false);
          onTaskUpdated?.();
        }}
      />
    </div>
  );
}
```

### Step 5: Add moveTask Method to AppContext

Update `src/context/AppContext.tsx`:

```typescript
// Add to AppContextType interface:
moveTask: (taskId: number, targetColumnId: number, newOrder: number) => Promise<void>;

// Add to AppProvider component:
const moveTask = async (taskId: number, targetColumnId: number, newOrder: number): Promise<void> => {
  try {
    const task = tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    // If moving to new column, update all order values
    if (task.columnId !== targetColumnId) {
      // Increment order for tasks in target column that are >= newOrder
      const targetColumnTasks = tasks.filter(
        t => t.columnId === targetColumnId && (t.order ?? 0) >= newOrder
      );
      
      for (const t of targetColumnTasks) {
        if (t.id && t.id !== taskId) {
          await db.tasks.update(t.id, { order: (t.order ?? 0) + 1 });
        }
      }

      // Update task: new column and order
      await db.tasks.update(taskId, { columnId: targetColumnId, order: newOrder });
    } else {
      // Same column reorder
      // If moving down, decrement order for tasks between old and new position
      const oldOrder = task.order ?? 0;
      if (newOrder > oldOrder) {
        const affectedTasks = tasks.filter(
          t => t.columnId === targetColumnId && 
               (t.order ?? 0) > oldOrder && 
               (t.order ?? 0) <= newOrder
        );
        for (const t of affectedTasks) {
          if (t.id && t.id !== taskId) {
            await db.tasks.update(t.id, { order: (t.order ?? 0) - 1 });
          }
        }
      } else if (newOrder < oldOrder) {
        // If moving up, increment order for tasks between new and old position
        const affectedTasks = tasks.filter(
          t => t.columnId === targetColumnId && 
               (t.order ?? 0) >= newOrder && 
               (t.order ?? 0) < oldOrder
        );
        for (const t of affectedTasks) {
          if (t.id && t.id !== taskId) {
            await db.tasks.update(t.id, { order: (t.order ?? 0) + 1 });
          }
        }
      }

      // Update task order
      await db.tasks.update(taskId, { order: newOrder });
    }

    // Reload tasks from Dexie
    const updatedTasks = await db.tasks.toArray();
    setTasks(updatedTasks);
  } catch (err: any) {
    console.error('Failed to move task:', err);
    throw new Error(err.message || 'Failed to move task');
  }
};

// Add to provider value:
value={{
  tasks,
  moveTask,
  // ... other methods
}}
```

### Step 6: Update KanbanBoard with DndContext

Update `src/components/KanbanBoard.tsx`:

```typescript
import { useCallback, useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import SortableColumn from './SortableColumn';

export default function KanbanBoard() {
  const { columns, tasks, moveTask } = useApp();
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: /* keyboard coordinate getter from @dnd-kit docs */,
    })
  );

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return; // No-op move

    try {
      setError(null);

      // Parse IDs: task IDs are numbers, column IDs are like "column-1"
      const taskId = Number(active.id);
      const targetColumnId = over.id.toString().startsWith('column-')
        ? Number(over.id.toString().replace('column-', ''))
        : Number(over.id);

      // Find target task's current order and column
      const activeTask = tasks.find(t => t.id === taskId);
      if (!activeTask) return;

      // Calculate new order based on position
      const columnTasks = tasks
        .filter(t => t.columnId === targetColumnId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const newOrder = columnTasks.length; // For now, append to end

      await moveTask(taskId, targetColumnId, newOrder);
    } catch (err: any) {
      setError(err.message || 'Failed to move task. Please try again.');
      console.error('Drag-and-drop error:', err);
    }
  }, [tasks, moveTask]);

  if (!columns.length) {
    return <div className="p-4 text-gray-500">No columns created yet.</div>;
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <SortableColumn
              key={column.id}
              column={column}
              tasks={tasks.filter(t => t.columnId === column.id)}
              onTaskUpdated={() => setError(null)}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
}
```

### Step 7: Update ColumnContent to Sort by Order

Update `src/components/ColumnContent.tsx`:

```typescript
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Column } from '@/db';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ColumnContentProps {
  column: Column;
}

export default function ColumnContent({ column }: ColumnContentProps) {
  const { tasks } = useApp();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Filter and sort tasks by order (NEW: use order field)
  const columnTasks = tasks
    .filter(t => t.columnId === column.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleTaskSaved = () => {
    setIsAddTaskOpen(false);
  };

  if (columnTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <p className="text-sm mb-3">No tasks yet</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddTaskOpen(true)}
          aria-label={`Add task to ${column.name}`}
          className="min-h-11 min-w-11"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add task
        </Button>
        <TaskForm
          open={isAddTaskOpen}
          onOpenChange={setIsAddTaskOpen}
          columnId={column.id!}
          onTaskSaved={handleTaskSaved}
        />
      </div>
    );
  }

  return (
    <div>
      {columnTasks.map(task => (
        <TaskCard key={task.id} task={task} onTaskUpdated={() => {}} />
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsAddTaskOpen(true)}
        className="w-full justify-start text-gray-500 hover:text-gray-700 mt-2"
        aria-label={`Add another task to ${column.name}`}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add task
      </Button>
      <TaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        columnId={column.id!}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
}
```

### Step 8: Handle prefers-reduced-motion

Create `src/hooks/useReducedMotion.ts`:

```typescript
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
```

Update `src/components/DraggableTaskCard.tsx` to respect prefers-reduced-motion:

```typescript
const { prefersReducedMotion } = useReducedMotion();

const style = {
  transform: CSS.Transform.toString(transform),
  transition: prefersReducedMotion ? 'none' : transition,
  opacity: isDragging ? 0.5 : 1,
  cursor: isDragging ? 'grabbing' : 'grab',
};
```

### Step 9: Handle Task Order on Creation

Update AppContext createTask to assign order:

```typescript
const createTask = async (columnId: number, data: TaskFormData): Promise<Task> => {
  try {
    const validData = taskFormSchema.parse(data);
    
    // Calculate order: count existing tasks in column + 1
    const columnTasks = tasks.filter(t => t.columnId === columnId);
    const newOrder = Math.max(...columnTasks.map(t => t.order ?? 0), -1) + 1;

    const now = new Date().toISOString();
    const taskData: Omit<Task, 'id'> = {
      ...validData,
      columnId,
      order: newOrder, // NEW: assign order
      createdAt: now,
      updatedAt: now,
    };
    
    const id = await db.tasks.add(taskData);
    const newTask: Task = { ...taskData, id };
    setTasks([...tasks, newTask]);
    return newTask;
  } catch (err: any) {
    console.error('Failed to create task:', err);
    throw new Error(err.message || 'Failed to create task');
  }
};
```

### Step 10: Test All Acceptance Criteria

Test checklist:
1. ✅ Move task between columns: drag, verify persists
2. ✅ Reorder tasks in same column: drag up/down, verify persists
3. ✅ Drop target highlights during drag
4. ✅ Drop indicator visible
5. ✅ Keyboard: Tab, arrows, Enter to move
6. ✅ Touch: long-press and drag
7. ✅ Error recovery: revert on failure
8. ✅ Performance: 60fps with 100+ tasks
9. ✅ Accessibility: screen reader announces, focus clear
10. ✅ Prefers reduced motion: animations disabled
11. ✅ Persistence: refresh, verify positions retained
12. ✅ No console errors

### Previous Story Intelligence (Story 1.5)

**Key Learnings from Story 1.5:**
- ✅ Task CRUD operations are fully functional
- ✅ Zod validation works well for task fields
- ✅ AppContext pattern handles state and Dexie sync correctly
- ✅ TaskCard component is stable and can be wrapped
- ✅ Dexie tasks store handles large datasets

**What Works in Story 1.5:**
- Task creation with all fields
- Task edit and delete
- Task persistence
- Validation and error messages
- Keyboard navigation in forms

**Use These Patterns in Story 1.6:**
- Follow same AppContext pattern for moveTask method
- Wrap TaskCard with @dnd-kit without breaking existing functionality
- Update Dexie with single write per move
- Maintain immutable state updates
- Handle errors with try/catch and user messages

### Git Commit History Context

Recent commits (Stories 1.1-1.5):
```
cdafd46 feat(story-1.5): Create and manage tasks with full fields - comprehensive developer guide
9a2e42c feat(story-1.4): Create comprehensive story for kanban board with customizable columns
b28b3af feat(story-1.3): Create comprehensive story for Dexie.js, React Router, and base Layout
94a2547 feat(story-1.2): Create comprehensive story for Tailwind, shadcn/ui, PWA, and path aliases
d6078bb docs(story-1.1): Update documentation to match implementation
```

**Commit Pattern:** `feat(story-X.Y): {description}`

**Commit for Story 1.6:**
```bash
git add -A
git commit -m "feat(story-1.6): Move and reorder tasks via drag-and-drop with @dnd-kit"
```

### Technical Anti-Patterns to Avoid

1. **❌ Don't mutate task order directly in state**
   - ✅ Always call `moveTask()` from AppContext
   - ✅ Let Context handle Dexie persistence and state updates

2. **❌ Don't forget to update order when creating tasks**
   - ✅ Assign order = max(existing orders) + 1 on creation
   - ✅ Keep order consistent across columns

3. **❌ Don't use @dnd-kit sensors without keyboard support**
   - ✅ Include KeyboardSensor for arrow key navigation
   - ✅ Test keyboard-only workflow

4. **❌ Don't forget prefers-reduced-motion**
   - ✅ Disable animations but keep functionality
   - ✅ Test with browser settings

5. **❌ Don't reorder all tasks on every move**
   - ✅ Only update affected tasks in Dexie
   - ✅ Keep moves efficient

6. **❌ Don't show technical errors to users**
   - ✅ Catch Dexie errors and show "Failed to move task. Please try again."
   - ✅ Log errors to console for debugging

7. **❌ Don't forget accessibility**
   - ✅ Use aria-label on draggable items
   - ✅ Announce moves to screen readers
   - ✅ Manage focus correctly

### Implementation Timeline Estimate

- **Update Task schema with order field:** 5 minutes
- **Update Dexie schema and add migration:** 10 minutes
- **Create DraggableTaskCard component:** 15 minutes
- **Create SortableColumn component:** 20 minutes
- **Add moveTask method to AppContext:** 20 minutes
- **Update KanbanBoard with DndContext:** 15 minutes
- **Update ColumnContent to sort by order:** 5 minutes
- **Handle prefers-reduced-motion:** 5 minutes
- **Handle task order on creation:** 5 minutes
- **Testing and verification:** 40 minutes
- **Accessibility testing (keyboard, screen reader):** 20 minutes
- **Performance optimization and testing:** 15 minutes
- **Total:** ~175 minutes

### Critical Success Signals

✅ **Must Verify:**
1. Drag task between columns, verify it moves and persists
2. Reorder tasks in same column, verify order persists
3. Drop target highlights during drag
4. Drop indicator shows insertion point
5. Keyboard: Tab to task, arrow keys, Enter to move
6. Touch: long-press and drag works smoothly
7. Error message shown if move fails, task reverts
8. 60fps during drag with 100+ tasks
9. Screen reader announces "Task moved to [column]"
10. Focus returns to moved task
11. Animations disabled with prefers-reduced-motion but drag still works
12. Refresh page, verify task in new position and column
13. Multiple moves in sequence work correctly
14. No console errors or warnings
15. TypeScript compiles without errors
16. Dev server starts: `npm run dev`
17. Production build completes: `npm run build`
18. All changes committed to git
19. Ready for Story 1.7 (Subtasks and quick-add)

### Accessibility Checklist (WCAG 2.1 AA)

- [ ] Draggable items have aria-label or aria-describedby
- [ ] Keyboard sensor configured for arrow keys
- [ ] Focus management: focus returns to moved item
- [ ] Move announcement: screen reader announces destination
- [ ] Visual feedback: drop target highlighting visible
- [ ] Animations respect prefers-reduced-motion
- [ ] Touch targets: draggable area at least 44×44px
- [ ] No keyboard traps: can Tab through all items
- [ ] Error messages: announced and visible (color + text)
- [ ] Semantic HTML: use proper ARIA roles for drag-drop regions

### Performance Considerations

- **Drag Animation:** Maintain 60fps (test with DevTools)
- **Large Datasets:** Handle 100+ tasks per column smoothly
- **Reorder Efficiency:** Update only affected tasks in Dexie
- **Re-renders:** Consider memoizing TaskCard if needed
- **Sensors:** Configure appropriately (pointer, touch, keyboard)

---

## Acceptance Criteria Mapping

| AC # | Requirement | How to Verify |
|------|-------------|---------------|
| 1 | Task moves between columns | Drag from column A to B, refresh, verify in B |
| 2 | Tasks reorder within column | Drag up/down in same column, verify order persists |
| 3 | Visual feedback during drag | Hover over drop zone, verify highlight and indicator |
| 4 | Keyboard support | Tab to task, arrows to move, Enter to drop |
| 5 | Touch support | Long-press and drag on mobile/tablet |
| 6 | Error recovery | Simulate Dexie error, verify task reverts, error shown |
| 7 | Performance | Drag with 100+ tasks, verify 60fps (Chrome DevTools) |
| 8 | Data integrity | Move task, refresh, verify position and column retained |

---

## Known Constraints & Gotchas

1. **Task Order and Dexie Indexing**
   - Always query tasks sorted by order: `tasks.sort((a,b) => (a.order??0) - (b.order??0))`
   - Index order field in Dexie for efficient queries

2. **Order Assignment on Move**
   - When moving to new column, reassign order values
   - When reordering in same column, recalculate affected tasks' order
   - Avoid order collisions: use Math.max/min to find insertion point

3. **Cross-Column Move Logic**
   - Task moves: columnId changes + order updates
   - Don't forget to update other tasks' order if inserting mid-list

4. **@dnd-kit ID Handling**
   - Task IDs are numbers, use directly (e.g., `task.id`)
   - Column IDs are wrapped like `column-1`, parse with `.replace('column-', '')`
   - Ensure consistency in DragEndEvent handler

5. **Accessibility Keyboard Sensor**
   - Configure KeyboardSensor with proper coordinateGetter
   - Test with: Tab to item, arrow keys to move, Enter to drop

6. **prefers-reduced-motion**
   - Disable transitions in CSS and React: `transition: prefersReducedMotion ? 'none' : transition`
   - But keep drag-and-drop functional (no animation, just position change)

7. **Error Recovery**
   - Always wrap moveTask in try/catch
   - Revert visual position on error before showing message
   - Reload tasks from Dexie on error to ensure consistency

8. **Task Order Edge Cases**
   - First task in column: order = 0
   - Adding to end: order = max(current orders) + 1
   - Inserting mid-list: update affected tasks' order values
   - Moving same task twice: recalculate new order each time

---

## Success Criteria

This story is **complete** when:

1. ✅ Task can be dragged between columns and persists
2. ✅ Tasks can be reordered within a column and order persists
3. ✅ Drop target highlights during drag
4. ✅ Drop indicator shows insertion point
5. ✅ Keyboard navigation: Tab, arrow keys, Enter to move
6. ✅ Touch drag-and-drop works smoothly
7. ✅ Error message shown if move fails; task reverts
8. ✅ Task order field added to schema and Dexie
9. ✅ moveTask method implemented in AppContext
10. ✅ DraggableTaskCard component wraps TaskCard with @dnd-kit
11. ✅ SortableColumn component with drop zone
12. ✅ KanbanBoard wrapped with DndContext
13. ✅ Tasks sorted by order field in ColumnContent
14. ✅ Task order assigned on creation
15. ✅ Screen reader announces moves and focus managed
16. ✅ Animations respect prefers-reduced-motion
17. ✅ 60fps drag-and-drop with 100+ tasks
18. ✅ Task position retained after page refresh
19. ✅ No console errors or TypeScript errors
20. ✅ Dev server runs: `npm run dev`
21. ✅ Production build completes: `npm run build`
22. ✅ All changes committed: `feat(story-1.6): Move and reorder tasks via drag-and-drop`
23. ✅ Ready for Story 1.7 (Subtasks and quick-add)

---

**Status:** in-progress

**Prepared by:** AI Development Agent + Ultimate Story Context Engine  
**Implementation Started:** 2026-03-12  
**Story ID:** 1.6  
**Epic:** 1 - Foundation & Core Kanban  
**Estimated Effort:** 160-200 minutes  
**Story Sequence:** 6 of 7 in Epic 1  
**Blocks:** Story 1.7  
**Blocked By:** Story 1.5 (COMPLETE)

**Implementation Checklist:**
1. ✅ Schema & context updates
2. ✅ Component creation  (DraggableTaskCard, SortableColumn, useReducedMotion)
3. ✅ Integration updates (KanbanBoard, ColumnHeader, ColumnContent, AppContext)
4. ✅ Build verification (TypeScript + Vite)
5. ⏳ E2E Tests (running across all browsers)
6. ⏳ Final verification and commit

**Developer Instructions:**
1. Read this entire story document
2. Update Task schema with order field
3. Update Dexie schema with order index and run migration
4. Create DraggableTaskCard component with @dnd-kit useSortable
5. Create SortableColumn component with SortableContext
6. Add moveTask method to AppContext
7. Update KanbanBoard with DndContext and drag-end handler
8. Update ColumnContent to sort tasks by order
9. Handle prefers-reduced-motion
10. Test drag-and-drop, keyboard, touch, and accessibility
11. Verify 60fps performance with Chrome DevTools
12. Test task order persistence after refresh
13. Verify error recovery on Dexie failure
14. Commit all changes to git
15. Proceed to Story 1.7
