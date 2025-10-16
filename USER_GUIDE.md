# 📘 Payroll Management System - User Guide

## 🚀 Quick Start

### Accessing the System
1. Open your browser and navigate to: `http://localhost/PMS_III/`
2. The dashboard will display with all employee records and statistics

## 🎯 Main Features

### 1. **Dashboard Overview**
The main screen shows:
- **Total Employees** - Count of all employees in system
- **Total Gross** - Sum of all gross salaries
- **Total Net** - Sum of all net salaries (after deductions)
- **Total Deductions** - Sum of all deductions

### 2. **Adding a New Employee**
**Method 1:** Click the green `+` button (top right or floating button on mobile)  
**Method 2:** Press `Ctrl + N` (Windows) or `Cmd + N` (Mac)

**Fill in the form:**
- **Personal Information**
  - Full Name (required)
  - Reference Number
  - Gender
  - Address & Postcode

- **Employer Information**
  - Employer name
  - Employer address

- **Tax & National Insurance**
  - Tax Period (e.g., 2024-25)
  - Tax Code (e.g., 1257L)
  - NI Number (e.g., AB123456C)
  - NI Code

- **Salary & Payment**
  - Pay Date
  - Inner City Allowance
  - Basic Salary
  - Overtime

💡 **Tip:** As you enter salary amounts, the calculator automatically shows:
- Gross Pay (total before deductions)
- Tax (9% of gross)
- Pension (5.5% of gross)
- Student Loan (2.5% of gross)
- National Insurance (2.3% of gross)
- Total Deductions
- Net Pay (take-home amount)

### 3. **Viewing Employee Details**
1. Find the employee in the table
2. Click the blue 👁️ **View** button
3. Review all details (form will be read-only)
4. Click **Close** when done

### 4. **Editing Employee Information**
1. Find the employee in the table
2. Click the yellow ✏️ **Edit** button
3. Update any fields as needed
4. Review the live calculations
5. Click **Update Employee** to save changes

### 5. **Deleting an Employee**
1. Find the employee in the table
2. Click the red 🗑️ **Delete** button
3. Confirm the deletion in the popup
4. ⚠️ **Warning:** This action cannot be undone!

### 6. **Searching for Employees**
**Method 1:** Type in the search box and click **Search**  
**Method 2:** Press `Ctrl + K` (Windows) or `Cmd + K` (Mac) to focus search

**You can search by:**
- Employee name
- Reference number
- Postcode
- NI number
- Employer name

**To clear search:** Click the ❌ button or navigate back to homepage

### 7. **Sorting the Table**
- Click any column header to sort by that column
- Click again to reverse the sort order
- Works with: ID, Name, Reference, Employer, Gross, Net, Deductions, Pay Date

### 8. **Pagination**
- Use page numbers at the bottom to navigate
- Shows 10 records per page
- Use ⏪ ⏩ arrows for first/last page
- Current page shows record range

### 9. **Exporting Data**
**Export to CSV:**
1. Click the **Export** button (header, top right)
2. File will download automatically
3. Open in Excel, Google Sheets, etc.

**Print Table:**
1. Click the **Print** button (header, top right)
2. Browser print dialog opens
3. Configure print settings and print

### 10. **Theme Toggle**
- Click the **Theme** button to switch between light and dark mode
- Your preference is saved automatically
- Reloads on next visit with your chosen theme

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` or `Cmd + K` | Focus search box |
| `Ctrl + N` or `Cmd + N` | Add new employee |
| `Esc` | Close modal/popup |
| `Tab` | Navigate between form fields |

## 💡 Tips & Tricks

### Best Practices
1. **Always verify calculations** - Review the live calculator before saving
2. **Use reference numbers** - Makes searching easier
3. **Regular exports** - Export data monthly for backup
4. **Complete all tax info** - Ensures accurate records for compliance

### Understanding Deductions
The system automatically calculates:
- **Tax (9%):** Income tax based on gross salary
- **Pension (5.5%):** Pension contribution
- **Student Loan (2.5%):** Student loan repayment
- **National Insurance (2.3%):** NI contribution

**Formula:**  
`Net Pay = Gross Pay - (Tax + Pension + Student Loan + NI)`

### Mobile Usage
- Green **+** button floats at bottom right
- Table scrolls horizontally if needed
- All features work on mobile devices
- Tap column headers to sort

## 🎨 Understanding the Interface

### Color Meanings
- 🟢 **Green** - Success, positive actions, gross amounts
- 🔵 **Blue** - Information, view actions, net amounts
- 🟡 **Yellow** - Edit, warnings, deductions
- 🔴 **Red** - Delete, critical actions
- 🟣 **Purple** - Primary actions, headers

### Icons Guide
- 👤 Personal information
- 🏢 Employer/business info
- 📊 Financial data
- 📅 Dates and periods
- 🔍 Search functionality
- ⚙️ Settings and actions
- 📥 Download/export
- 🖨️ Print
- 🌙 Theme toggle

## ❓ Troubleshooting

### "Employee name is required" error
- Make sure to fill in the employee name field
- Name must be at least 2 characters long

### Search returns no results
- Check spelling
- Try partial names (e.g., "John" instead of "John Smith")
- Clear filters and try again

### Calculator not updating
- Make sure JavaScript is enabled
- Try refreshing the page
- Check that you're entering valid numbers

### Theme not saving
- Enable cookies in your browser
- Check that localStorage is enabled
- Try clearing browser cache

### Export not working
- Ensure pop-ups are not blocked
- Check browser download settings
- Try different browser if issue persists

## 📞 Support

For technical issues or questions:
1. Check this user guide first
2. Review the UPDATES.md file for recent changes
3. Contact your system administrator

## 🔐 Security Notes

- Never share your login credentials
- Log out when finished (if authentication is added)
- Regular data exports recommended for backup
- Keep employee data confidential

---

**System Version:** 2.0  
**Last Updated:** October 16, 2025  

**Happy Payroll Management! 💼💰**
