# HyperGro Form Builder

A powerful, intuitive drag-and-drop form builder that allows you to create multi-step forms with ease. Built with React and Remix for a seamless user experience.

[IMAGE: Screenshot of the form builder interface]

## Features

- **Drag-and-Drop Interface**: Easily build forms by dragging elements from the sidebar to your canvas
- **Multi-Step Forms**: Create forms with multiple steps to improve user experience
- **Live Preview**: See how your form will look to users in real-time
- **Form Templates**: Start with pre-built templates for common use cases
- **Local Storage**: Forms and responses are saved in localStorage for easy access
- **Shareable Forms**: Generate unique links to share your forms with others
- **Form Validation**: Built-in validation for all field types

[IMAGE: GIF showing drag and drop functionality]

## Technologies Used

- React
- Remix
- TailwindCSS
- LocalStorage for data persistence
- Vite for fast development

## Installation

1. Clone the repository:
```bash
git clone https://github.com/itsspriyansh/hypergo-form-builder.git
cd hypergro-form-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Application Pages

### Home Page
The landing page provides an overview of the application with quick access to create new forms or access existing ones.

### Form Builder (`/create`)
The main form creation workspace where you can:
- Drag and drop form elements
- Organize fields into multiple steps
- Configure each field's properties
- Preview your form in real-time
- Save and share your form

### Form Templates (`/templates`)
Browse a collection of pre-built form templates organized by category:
- Business feedback forms
- Contact forms
- Application forms
- Survey templates
- Event registration forms

Templates can be filtered by category and searched by name or description. Select any template to use it as a starting point for your own form.

### Forms Dashboard (`/forms`)
Manage all your created forms in one place:
- View a list of all saved forms
- See response counts for each form
- Edit existing forms
- Delete forms you no longer need
- Copy shareable links for your forms
- Select multiple forms for batch operations

### Form View (`/:formId`)
The public-facing view of your form that respondents will see:
- Clean, user-friendly interface
- Step-by-step navigation
- Field validation
- Submission confirmation
- Responsive design for all devices

## Drag and Drop Functionality

### Field Dragging
HyperGo Form Builder features a powerful and intuitive drag-and-drop system:

1. **Field Palette**: The sidebar contains a palette of field types that can be dragged onto the form canvas.

2. **Field Placement**: 
   - Drag a field from the sidebar to any step section
   - Fields snap into place with visual feedback
   - The canvas highlights drop zones as you drag

3. **Field Reordering**:
   - Drag existing fields up or down within a step to reorder them
   - Visual indicators show where the field will be placed
   - Smooth animations provide clear feedback during dragging

4. **Cross-Step Movement**:
   - Drag fields between different steps to reorganize your form
   - Each step has its own drop zone that highlights when a field is dragged over it
   - Moving a field to another step automatically updates its step property

### Step Management
Steps themselves can also be dragged and reordered:

1. **Step Reordering**:
   - Each step has a drag handle on the left
   - Drag steps up or down to change their order
   - All fields within the step maintain their association with the step

2. **Step Operations**:
   - Add new steps with the "Add New Step" button
   - Remove steps with the delete button (fields in that step are reassigned or removed)
   - Steps automatically renumber when reordered

3. **Visual Feedback**:
   - Steps highlight when being dragged
   - Drop zones appear between steps when dragging
   - Smooth animations show the step movement

## Auto-Save and LocalStorage Features

HyperGo Form Builder uses browser localStorage to provide a seamless form building experience:

### Draft Auto-Save
- **Continuous Saving**: As you build your form, changes are automatically saved to localStorage as a draft
- **Save Indicator**: A subtle notification appears when your form is saved
- **Draft Recovery**: If you close the browser or navigate away, your work is preserved
- **Last Edit Tracking**: The system records when you last edited the form

### Draft Management
- **Draft Notice**: When returning to the builder, you'll see a notification about your saved draft
- **Time Indicators**: See how long ago your draft was last edited
- **Easy Resumption**: Continue working on your form exactly where you left off
- **Draft Dismissal**: Option to clear the draft and start fresh

### Form Storage
- **Saved Forms**: Completed forms are stored in localStorage under a different key than drafts
- **Multiple Forms**: Create and save multiple forms in your browser
- **Form Metadata**: Each form stores its name, creation date, fields, and response count
- **Shareable IDs**: Each form gets a unique ID for sharing and accessing responses

### Response Collection
- **Response Storage**: Form submissions are stored in localStorage
- **Response Association**: Each response is linked to its corresponding form
- **Submission Timestamps**: Track when each response was submitted
- **Response Counter**: Forms track how many responses they've received

### LocalStorage Keys
The application uses several localStorage keys:
- `draftForm`: Stores the current draft form being edited
- `savedForms`: Stores all completed and saved forms
- `formResponses`: Stores all form submissions

### Data Persistence
- While localStorage provides convenience, it's browser-specific
- For production use, consider implementing backend storage for forms and responses

## Field Configuration

When editing a field, you can configure various properties:

- **Label**: The field's display name
- **Placeholder Text**: Helper text shown inside the field
- **Help Text**: Additional information displayed below the field
- **Required**: Toggle whether the field must be filled
- **Validation**: Set minimum/maximum length for text fields
- **Options**: For dropdowns and radio buttons, manage the available choices
- **Step Assignment**: Assign the field to a specific form step

[IMAGE: Screenshot of field configuration modal]

## Form Preview Mode

Test your form as users will experience it:
- Toggle between edit and preview modes
- Navigate through steps in preview mode
- Test field validation and interactions
- See exactly what respondents will experience

---

Built with ❤️ by @itsspriyansh
