# 💼 Payroll Management System v2.0

A modern, feature-rich web-based payroll management system built with PHP, MySQL, and Bootstrap 5.

![Version](https://img.shields.io/badge/version-2.0-blue)
![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple)
![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-orange)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)

## ✨ Features

### 🎨 Modern UI/UX
- Beautiful gradient-based design
- Smooth animations and transitions
- Responsive mobile-first layout
- Dark mode support with theme persistence
- Icon-rich interface using Bootstrap Icons

### 📊 Employee Management
- Add, view, edit, and delete employees
- Comprehensive employee information storage
- Real-time salary calculations
- Search across multiple fields
- Sortable data tables
- Pagination for large datasets

### 💰 Payroll Calculations
- Automatic calculation of:
  - Gross pay (Inner City + Basic Salary + Overtime)
  - Tax deductions (9%)
  - Pension contributions (5.5%)
  - Student loan repayments (2.5%)
  - National Insurance (2.3%)
  - Net pay (take-home)
- Live preview calculator in forms
- Accurate financial totals dashboard

### 🚀 Advanced Features
- Export to CSV for Excel/Sheets
- Print-friendly table layouts
- Keyboard shortcuts (Ctrl+K, Ctrl+N)
- Toast notifications for user feedback
- Form validation (client & server-side)
- Secure database queries (PDO with prepared statements)

## 📋 Requirements

- **Web Server:** Apache 2.4+ (XAMPP, WAMP, or similar)
- **PHP:** 7.4 or higher
- **MySQL:** 5.7 or higher
- **Browser:** Modern browser (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

### 1. Clone or Download
```bash
git clone https://github.com/Kalharapasan/Payroll-Management-System-III.git
cd Payroll-Management-System-III
```

### 2. Database Setup
```sql
-- Import the database
mysql -u root -p < Data_Bases.sql

-- Or use phpMyAdmin:
-- 1. Open phpMyAdmin
-- 2. Create database 'payroll_db'
-- 3. Import Data_Bases.sql
```

### 3. Configure Database Connection
Edit `config.php` with your database credentials:
```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'payroll_db');
define('DB_USER', 'root');
define('DB_PASS', '');
```

### 4. Start Server
```bash
# If using XAMPP
# 1. Start Apache and MySQL from XAMPP Control Panel
# 2. Place project in htdocs folder
# 3. Navigate to: http://localhost/PMS_III/
```

## 📁 Project Structure

```
PMS_III/
├── index.php          # Main application file
├── config.php         # Database configuration
├── style.css          # Enhanced styling
├── js.js             # JavaScript functionality
├── Data_Bases.sql    # Database schema
├── README.md         # This file
├── UPDATES.md        # Detailed changelog
└── USER_GUIDE.md     # User documentation
```

## 🎯 Usage

### Adding an Employee
1. Click the green `+` button or press `Ctrl+N`
2. Fill in employee details
3. Watch the live calculation update
4. Click "Add Employee"

### Searching
1. Type in the search box (or press `Ctrl+K`)
2. Search by name, reference, postcode, NI number, or employer
3. Click Search or press Enter

### Exporting Data
- **CSV Export:** Click the Export button in header
- **Print:** Click the Print button in header

### Keyboard Shortcuts
- `Ctrl+K` / `Cmd+K` - Focus search
- `Ctrl+N` / `Cmd+N` - Add new employee
- `Esc` - Close modal

## 🎨 Customization

### Changing Colors
Edit CSS variables in `style.css`:
```css
:root {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-success: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  /* ... more variables ... */
}
```

### Modifying Tax Rates
Edit the calculation function in `index.php`:
```php
function calc_from_components($inner_city, $basic_salary, $overtime) {
    // Adjust percentages here
    $taxable = ($gross * 9) / 100.0;    // 9% tax
    $pension = ($gross * 5.5) / 100.0;   // 5.5% pension
    // ...
}
```

## 🔒 Security Features

- ✅ PDO with prepared statements (SQL injection prevention)
- ✅ Input sanitization with `htmlspecialchars()`
- ✅ CSRF protection ready
- ✅ XSS prevention
- ✅ Secure password hashing (for future authentication)

## 📱 Responsive Design

- ✅ Mobile-optimized layouts
- ✅ Touch-friendly buttons
- ✅ Responsive tables with horizontal scroll
- ✅ Floating action button on mobile
- ✅ Collapsible navigation on small screens

## 🌙 Dark Mode

Theme toggles automatically save user preference:
- Click "Theme" button in header
- Persists across sessions using localStorage
- All components styled for both themes

## 📊 Database Schema

### employees table
```sql
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_name VARCHAR(255),
    address VARCHAR(255),
    postcode VARCHAR(20),
    gender VARCHAR(1),
    reference_no VARCHAR(50),
    employer VARCHAR(255),
    emp_address VARCHAR(255),
    tax_period VARCHAR(50),
    tax_code VARCHAR(20),
    pay_date DATE,
    inner_city DECIMAL(10,2),
    basic_salary DECIMAL(10,2),
    overtime DECIMAL(10,2),
    gross_pay DECIMAL(10,2),
    taxable_pay DECIMAL(10,2),
    pensionable_pay DECIMAL(10,2),
    student_loan DECIMAL(10,2),
    ni_payment DECIMAL(10,2),
    deduction DECIMAL(10,2),
    net_pay DECIMAL(10,2),
    tax_todate DECIMAL(10,2),
    pension_todate DECIMAL(10,2),
    student_ref VARCHAR(50),
    ni_code VARCHAR(10),
    ni_number VARCHAR(20),
    ref_note TEXT
);
```

## 🔧 Troubleshooting

### Database Connection Failed
- Check MySQL service is running
- Verify credentials in `config.php`
- Ensure database exists

### Styles Not Loading
- Check file paths are correct
- Clear browser cache
- Verify Apache is running

### Calculator Not Working
- Enable JavaScript in browser
- Check console for errors
- Ensure Bootstrap JS is loaded

## 🚧 Future Enhancements

- [ ] User authentication & authorization
- [ ] Role-based access control (Admin, Manager, User)
- [ ] Payslip generation (PDF)
- [ ] Email notifications
- [ ] Dashboard charts & analytics
- [ ] Bulk operations
- [ ] Advanced filtering
- [ ] Audit trail/logs
- [ ] API endpoints for mobile apps
- [ ] Multi-currency support
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Kalhara Pasan**
- GitHub: [@Kalharapasan](https://github.com/Kalharapasan)
- Repository: [Payroll-Management-System-III](https://github.com/Kalharapasan/Payroll-Management-System-III)

## 🙏 Acknowledgments

- Bootstrap 5 for the UI framework
- Bootstrap Icons for the icon set
- PHP & MySQL communities

## 📞 Support

For issues and questions:
1. Check the [USER_GUIDE.md](USER_GUIDE.md)
2. Review [UPDATES.md](UPDATES.md) for recent changes
3. Open an issue on GitHub
4. Contact the maintainer

---

**Made with ❤️ for efficient payroll management**

*Version 2.0 - October 2025*
