<?php 
    require_once __DIR__ . '/config.php';
    
    try {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME);
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo "<h1>Database connection failed</h1><p>".htmlspecialchars($e->getMessage())."</p>";
        exit;
    }

    function calc_from_components($inner_city, $basic_salary, $overtime) {
        $inner_city = (float)$inner_city;
        $basic_salary = (float)$basic_salary;
        $overtime = (float)$overtime;

        $gross = $inner_city + $basic_salary + $overtime;
        $taxable = ($gross * 9) / 100.0; 
        $pension = ($gross * 5.5) / 100.0;
        $student = ($gross * 2.5) / 100.0; 
        $ni = ($gross * 2.3) / 100.0; 
        $deductions = $taxable + $pension + $student + $ni;
        $net = $gross - $deductions;

        return [
            'gross_pay' => round($gross, 2),
            'taxable_pay' => round($taxable, 2),
            'pensionable_pay' => round($pension, 2),
            'student_loan' => round($student, 2),
            'ni_payment' => round($ni, 2),
            'deduction' => round($deductions, 2),
            'net_pay' => round($net, 2),
            'tax_todate' => round($taxable, 2),
            'pension_todate' => round($pension, 2),
        ];
    }

    function s($v) { return htmlspecialchars((string)$v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

    $all_fields = [
        'employee_name','address','postcode','gender','reference_no','employer','emp_address','tax_period','tax_code','pay_date',
        'inner_city','basic_salary','overtime','gross_pay','taxable_pay','pensionable_pay','student_loan','ni_payment','deduction','net_pay',
        'tax_todate','pension_todate','student_ref','ni_code','ni_number','ref_note'
    ];

    $errors = [];
    $messages = [];
    
    // Handle AJAX requests for analytics
    if (isset($_GET['ajax']) && $_GET['ajax'] === 'analytics') {
        header('Content-Type: application/json');
        
        $monthlyStmt = $pdo->query("
            SELECT DATE_FORMAT(pay_date, '%Y-%m') as month, 
                   COUNT(*) as count,
                   SUM(gross_pay) as total_gross,
                   SUM(net_pay) as total_net,
                   SUM(deduction) as total_deductions
            FROM employees 
            WHERE pay_date IS NOT NULL AND pay_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY month 
            ORDER BY month DESC
        ");
        
        $genderStmt = $pdo->query("
            SELECT gender, COUNT(*) as count, SUM(gross_pay) as total
            FROM employees 
            GROUP BY gender
        ");
        
        $departmentStmt = $pdo->query("
            SELECT employer, COUNT(*) as count, SUM(gross_pay) as total, AVG(gross_pay) as avg
            FROM employees 
            GROUP BY employer
            ORDER BY total DESC
            LIMIT 10
        ");
        
        echo json_encode([
            'monthly' => $monthlyStmt->fetchAll(),
            'gender' => $genderStmt->fetchAll(),
            'departments' => $departmentStmt->fetchAll()
        ]);
        exit;
    }
    
    // Handle bulk operations
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = $_POST['action'] ?? '';

        if ($action === 'bulk_delete' && isset($_POST['ids'])) {
            $ids = array_filter(array_map('intval', $_POST['ids']));
            if (!empty($ids)) {
                try {
                    $placeholders = implode(',', array_fill(0, count($ids), '?'));
                    $stmt = $pdo->prepare("DELETE FROM employees WHERE id IN ($placeholders)");
                    $stmt->execute($ids);
                    $messages[] = count($ids) . ' employee(s) deleted successfully.';
                } catch (Exception $e) {
                    $errors[] = 'Bulk delete failed: ' . $e->getMessage();
                }
            }
        } elseif ($action === 'add' || $action === 'update') {
            $data = [];
            foreach ($all_fields as $f) {
                $data[$f] = $_POST[$f] ?? null;
            }

            if (empty(trim($data['employee_name'] ?? ''))) $errors[] = 'Employee name is required.';
            if (!in_array(strtolower($data['gender']), ['m','f',''], true)) $data['gender'] = null;

            $data['inner_city'] = str_replace(',', '', $data['inner_city'] ?: 0);
            $data['basic_salary'] = str_replace(',', '', $data['basic_salary'] ?: 0);
            $data['overtime'] = str_replace(',', '', $data['overtime'] ?: 0);

            if (empty($errors)) {
                $calc = calc_from_components($data['inner_city'], $data['basic_salary'], $data['overtime']);
                $data = array_merge($data, $calc);

                try {
                    if ($action === 'add') {
                        $cols = array_keys($data);
                        $placeholders = array_map(function($c){ return ':' . $c; }, $cols);
                        $sql = 'INSERT INTO employees (' . implode(',', $cols) . ') VALUES (' . implode(',', $placeholders) . ')';
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute($data);
                        $messages[] = 'Employee added successfully.';
                    } else {
                        $id = (int)($_POST['id'] ?? 0);
                        if ($id <= 0) throw new Exception('Invalid employee id for update.');
                        $sets = array_map(function($c){ return "$c=:$c"; }, array_keys($data));
                        $sql = 'UPDATE employees SET ' . implode(',', $sets) . ' WHERE id = :id';
                        $stmt = $pdo->prepare($sql);
                        $data_with_id = $data; $data_with_id['id'] = $id;
                        $stmt->execute($data_with_id);
                        $messages[] = 'Employee updated successfully.';
                    }
                } catch (Exception $e) {
                    $errors[] = 'Database error: ' . $e->getMessage();
                }
            }
        } elseif ($action === 'delete') {
            $id = (int)($_POST['id'] ?? 0);
            if ($id > 0) {
                try {
                    $stmt = $pdo->prepare('DELETE FROM employees WHERE id = :id');
                    $stmt->execute(['id' => $id]);
                    $messages[] = 'Employee deleted.';
                } catch (Exception $e) {
                    $errors[] = 'Delete failed: ' . $e->getMessage();
                }
            } else {
                $errors[] = 'Invalid id for deletion.';
            }
        }
    }

    $search = trim($_GET['q'] ?? '');
    $filterGender = $_GET['gender'] ?? '';
    $filterEmployer = $_GET['employer'] ?? '';
    $sortBy = $_GET['sort'] ?? 'id';
    $sortDir = $_GET['dir'] ?? 'DESC';
    $page = max(1, (int)($_GET['page'] ?? 1));
    $per_page = (int)($_GET['per_page'] ?? 10);
    $offset = ($page - 1) * $per_page;

    $params = [];
    $where = [];
    
    if ($search !== '') {
        $where[] = "(employee_name LIKE :q OR reference_no LIKE :q OR postcode LIKE :q OR ni_number LIKE :q OR employer LIKE :q)";
        $params[':q'] = "%$search%";
    }
    
    if ($filterGender !== '') {
        $where[] = "gender = :gender";
        $params[':gender'] = $filterGender;
    }
    
    if ($filterEmployer !== '') {
        $where[] = "employer = :employer";
        $params[':employer'] = $filterEmployer;
    }
    
    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
    
    $allowedSort = ['id', 'employee_name', 'gross_pay', 'net_pay', 'pay_date', 'employer'];
    $sortBy = in_array($sortBy, $allowedSort) ? $sortBy : 'id';
    $sortDir = strtoupper($sortDir) === 'ASC' ? 'ASC' : 'DESC';

    $totalsStmt = $pdo->prepare("SELECT COUNT(*) as total_count, IFNULL(SUM(gross_pay),0) as total_gross, IFNULL(SUM(net_pay),0) as total_net, IFNULL(SUM(deduction),0) as total_ded FROM employees $whereClause");
    $totalsStmt->execute($params);
    $totals = $totalsStmt->fetch();

    $listSql = "SELECT * FROM employees $whereClause ORDER BY $sortBy $sortDir LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($listSql);
    foreach ($params as $k=>$v) $stmt->bindValue($k, $v);
    $stmt->bindValue(':limit', (int)$per_page, PDO::PARAM_INT);
    $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();

    $countSql = "SELECT COUNT(*) FROM employees $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total_records = (int)$countStmt->fetchColumn();
    $total_pages = max(1, ceil($total_records / $per_page));
    
    // Get employers for filter
    $employersStmt = $pdo->query("SELECT DISTINCT employer FROM employees WHERE employer IS NOT NULL AND employer != '' ORDER BY employer");
    $employers = $employersStmt->fetchAll(PDO::FETCH_COLUMN);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Advanced Payroll Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <div id="toastContainer" class="toast-container"></div>

    <header class="gradient-header mb-4">
        <div class="container d-flex justify-content-between align-items-center py-3">
            <div>
                <h1 class="text-white mb-0">
                    <i class="bi bi-cash-stack me-2"></i>Advanced Payroll Dashboard
                </h1>
                <small class="text-white-50">Complete payroll management with analytics</small>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-light" id="btnAnalytics" title="View Analytics">
                    <i class="bi bi-graph-up"></i> <span class="d-none d-md-inline">Analytics</span>
                </button>
                <button class="btn btn-outline-light" id="btnExportCSV" title="Export to CSV">
                    <i class="bi bi-download"></i> <span class="d-none d-md-inline">Export</span>
                </button>
                <button class="btn btn-outline-light" id="btnPrint" title="Print Table">
                    <i class="bi bi-printer"></i> <span class="d-none d-md-inline">Print</span>
                </button>
                <button class="btn btn-outline-light" id="btnTheme" title="Toggle Theme">
                    <i class="bi bi-moon-stars"></i> <span class="d-none d-md-inline">Theme</span>
                </button>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
            <div>
                <h3 class="mb-0"><i class="bi bi-people-fill me-2"></i>Employees</h3>
                <small class="text-muted">
                    <i class="bi bi-database"></i> Total records: <strong><?= $total_records ?></strong>
                    <span class="ms-2">
                        <i class="bi bi-lightbulb"></i> Press <kbd>Ctrl+K</kbd> to search, <kbd>Ctrl+N</kbd> to add
                    </span>
                </small>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button id="btnBulkActions" class="btn btn-outline-danger" style="display:none;" title="Bulk Delete">
                    <i class="bi bi-trash"></i> Delete Selected
                </button>
                <button id="floatingAdd" class="fab" title="Add employee (Ctrl+N)">+</button>
            </div>
        </div>

        <?php foreach ($messages as $m): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i><?= s($m) ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        <?php endforeach; ?>
        <?php foreach ($errors as $e): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i><?= s($e) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endforeach; ?>

        <div class="row g-3 mb-3">
            <div class="col-md-3">
                <div class="card stat-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-muted">Total Employees</small>
                                <div class="h4 mb-0"><?= (int)$totals['total_count'] ?></div>
                            </div>
                            <i class="bi bi-people-fill text-primary" style="font-size: 2rem; opacity: 0.3;"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-muted">Total Gross</small>
                                <div class="h5 monos mb-0">£<?= number_format((float)$totals['total_gross'],2) ?></div>
                            </div>
                            <i class="bi bi-currency-pound text-success" style="font-size: 2rem; opacity: 0.3;"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-muted">Total Net</small>
                                <div class="h5 monos mb-0">£<?= number_format((float)$totals['total_net'],2) ?></div>
                            </div>
                            <i class="bi bi-wallet2 text-info" style="font-size: 2rem; opacity: 0.3;"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-muted">Total Deductions</small>
                                <div class="h5 monos mb-0">£<?= number_format((float)$totals['total_ded'],2) ?></div>
                            </div>
                            <i class="bi bi-arrow-down-circle text-warning" style="font-size: 2rem; opacity: 0.3;"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Advanced Filters -->
        <div class="card mb-3">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-search"></i></span>
                            <input id="searchInput" value="<?= s($search) ?>" class="form-control" placeholder="Search...">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <select id="filterGender" class="form-select">
                            <option value="">All Genders</option>
                            <option value="m" <?= $filterGender === 'm' ? 'selected' : '' ?>>Male</option>
                            <option value="f" <?= $filterGender === 'f' ? 'selected' : '' ?>>Female</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select id="filterEmployer" class="form-select">
                            <option value="">All Employers</option>
                            <?php foreach ($employers as $emp): ?>
                                <option value="<?= s($emp) ?>" <?= $filterEmployer === $emp ? 'selected' : '' ?>><?= s($emp) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <select id="perPage" class="form-select">
                            <option value="10" <?= $per_page === 10 ? 'selected' : '' ?>>10 per page</option>
                            <option value="25" <?= $per_page === 25 ? 'selected' : '' ?>>25 per page</option>
                            <option value="50" <?= $per_page === 50 ? 'selected' : '' ?>>50 per page</option>
                            <option value="100" <?= $per_page === 100 ? 'selected' : '' ?>>100 per page</option>
                        </select>
                    </div>
                    <div class="col-md-1">
                        <button id="btnApplyFilters" class="btn btn-primary w-100">
                            <i class="bi bi-funnel"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body p-0">
                <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="table-dark">
                    <tr>
                        <th><input type="checkbox" id="selectAll" class="form-check-input"></th>
                        <th class="sortable" data-sort="id"><i class="bi bi-hash"></i> ID</th>
                        <th class="sortable" data-sort="employee_name"><i class="bi bi-person-badge"></i> Name</th>
                        <th class="sortable" data-sort="employer"><i class="bi bi-building"></i> Employer</th>
                        <th class="sortable" data-sort="gross_pay"><i class="bi bi-cash"></i> Gross</th>
                        <th class="sortable" data-sort="net_pay"><i class="bi bi-wallet"></i> Net</th>
                        <th><i class="bi bi-arrow-down"></i> Deductions</th>
                        <th class="sortable" data-sort="pay_date"><i class="bi bi-calendar-event"></i> Pay Date</th>
                        <th><i class="bi bi-gear"></i> Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php if (empty($rows)): ?>
                        <tr>
                            <td colspan="10" class="text-center py-5">
                                <i class="bi bi-inbox" style="font-size: 3rem; opacity: 0.3;"></i>
                                <p class="text-muted mt-2">No records found.</p>
                            </td>
                        </tr>
                    <?php else: foreach ($rows as $r): ?>
                        <tr>
                            <td><input type="checkbox" class="form-check-input row-select" value="<?= (int)$r['id'] ?>"></td>
                            <td><strong><?= (int)$r['id'] ?></strong></td>
                            <td>
                                <strong><?= s($r['employee_name']) ?></strong><br>
                                <small class="text-muted">
                                    <i class="bi bi-geo-alt"></i> <?= s($r['address']) ?> <?= s($r['postcode']) ?>
                                </small>
                            </td>
                            <td>
                                <strong><?= s($r['employer']) ?></strong><br>
                                <small class="text-muted"><?= s($r['emp_address']) ?></small>
                            </td>
                            <td class="monos text-success"><strong>£<?= number_format((float)$r['gross_pay'],2) ?></strong></td>
                            <td class="monos text-primary"><strong>£<?= number_format((float)$r['net_pay'],2) ?></strong></td>
                            <td class="monos text-warning"><strong>£<?= number_format((float)$r['deduction'],2) ?></strong></td>
                            <td>
                                <small>
                                    <i class="bi bi-calendar3"></i> 
                                    <?= s($r['pay_date']) ? date('M d, Y', strtotime($r['pay_date'])) : '-' ?>
                                </small>
                            </td>
                            <td>
                                <div class="btn-group btn-group-sm" role="group">
                                    <button class="btn btn-info btnView" data-row='<?= json_encode($r, JSON_HEX_APOS|JSON_HEX_QUOT) ?>' title="View Details">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                    <button class="btn btn-warning btnEdit" data-row='<?= json_encode($r, JSON_HEX_APOS|JSON_HEX_QUOT) ?>' title="Edit Employee">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <form method="post" style="display:inline" onsubmit="return confirm('⚠️ Delete employee: <?= s($r['employee_name']) ?>?\n\nThis action cannot be undone.');">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="id" value="<?= (int)$r['id'] ?>">
                                        <button class="btn btn-danger btn-sm" title="Delete Employee">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; endif; ?>
                    </tbody>
                </table>
                </div>
            </div>
        </div>

        <?php if ($total_pages > 1): ?>
        <nav class="mt-3 d-flex justify-content-between align-items-center" aria-label="pagination">
            <div>
                <small class="text-muted">
                    Showing page <?= $page ?> of <?= $total_pages ?>
                    (<?= (($page - 1) * $per_page) + 1 ?> - <?= min($page * $per_page, $total_records) ?> of <?= $total_records ?> records)
                </small>
            </div>
            <ul class="pagination mb-0">
                <?php if ($page > 1): ?>
                    <li class="page-item">
                        <a class="page-link" href="?page=1" title="First page">
                            <i class="bi bi-chevron-double-left"></i>
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="?page=<?= $page - 1 ?>" title="Previous page">
                            <i class="bi bi-chevron-left"></i>
                        </a>
                    </li>
                <?php endif; ?>
                
                <?php for ($p = max(1, $page - 2); $p <= min($total_pages, $page + 2); $p++): ?>
                    <li class="page-item <?= $p === $page ? 'active' : '' ?>">
                        <a class="page-link" href="?page=<?= $p ?>"><?= $p ?></a>
                    </li>
                <?php endfor; ?>
                
                <?php if ($page < $total_pages): ?>
                    <li class="page-item">
                        <a class="page-link" href="?page=<?= $page + 1 ?>" title="Next page">
                            <i class="bi bi-chevron-right"></i>
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="?page=<?= $total_pages ?>" title="Last page">
                            <i class="bi bi-chevron-double-right"></i>
                        </a>
                    </li>
                <?php endif; ?>
            </ul>
        </nav>
        <?php endif; ?>
    </div>

    <!-- Analytics Modal -->
    <div class="modal fade" id="modalAnalytics" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="bi bi-graph-up"></i> Payroll Analytics</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label"><i class="bi bi-gender-ambiguous"></i> Gender</label>
                            <select name="gender" id="gender" class="form-select">
                                <option value="">Select...</option>
                                <option value="m">Male</option>
                                <option value="f">Female</option>
                            </select>
                        </div>
                        <div class="col-md-8">
                            <label class="form-label"><i class="bi bi-geo-alt"></i> Address</label>
                            <input name="address" id="address" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label"><i class="bi bi-mailbox"></i> Postcode</label>
                            <input name="postcode" id="postcode" class="form-control">
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <h6 class="text-primary border-bottom pb-2 mb-3">
                        <i class="bi bi-building"></i> Employer Information
                    </h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label"><i class="bi bi-briefcase"></i> Employer</label>
                            <input name="employer" id="employer" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label"><i class="bi bi-geo"></i> Employer Address</label>
                            <input name="emp_address" id="emp_address" class="form-control">
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <h6 class="text-primary border-bottom pb-2 mb-3">
                        <i class="bi bi-receipt"></i> Tax & National Insurance
                    </h6>
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label"><i class="bi bi-calendar-range"></i> Tax Period</label>
                            <input name="tax_period" id="tax_period" class="form-control" placeholder="e.g., 2024-25">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label"><i class="bi bi-file-text"></i> Tax Code</label>
                            <input name="tax_code" id="tax_code" class="form-control" placeholder="e.g., 1257L">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label"><i class="bi bi-hash"></i> NI Number</label>
                            <input name="ni_number" id="ni_number" class="form-control" placeholder="e.g., AB123456C">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label"><i class="bi bi-code-square"></i> NI Code</label>
                            <input name="ni_code" id="ni_code" class="form-control">
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <h6 class="text-primary border-bottom pb-2 mb-3">
                        <i class="bi bi-cash-coin"></i> Salary & Payment Details
                    </h6>
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label"><i class="bi bi-calendar-event"></i> Pay Date</label>
                            <input name="pay_date" id="pay_date" class="form-control" type="date">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label"><i class="bi bi-building"></i> Inner City Allowance</label>
                            <div class="input-group">
                                <span class="input-group-text">£</span>
                                <input name="inner_city" id="inner_city" class="form-control" type="number" step="0.01" value="0">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label"><i class="bi bi-wallet2"></i> Basic Salary</label>
                            <div class="input-group">
                                <span class="input-group-text">£</span>
                                <input name="basic_salary" id="basic_salary" class="form-control" type="number" step="0.01" value="0">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label"><i class="bi bi-clock"></i> Overtime</label>
                            <div class="input-group">
                                <span class="input-group-text">£</span>
                                <input name="overtime" id="overtime" class="form-control" type="number" step="0.01" value="0">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <h6 class="text-success border-bottom pb-2 mb-3">
                        <i class="bi bi-calculator"></i> Calculated Values (Live Preview)
                    </h6>
                    <div class="row g-3">
                        <div class="col-md-4 col-6">
                            <div class="calc-card text-center">
                                <small class="text-muted d-block">Gross Pay</small>
                                <strong id="calc_gross" class="h5">£0.00</strong>
                            </div>
                        </div>
                        <div class="col-md-4 col-6">
                            <div class="calc-card text-center">
                                <small class="text-muted d-block">Net Pay</small>
                                <strong id="calc_net" class="h5 text-success">£0.00</strong>
                            </div>
                        </div>
                        <div class="col-md-4 col-6">
                            <div class="calc-card text-center">
                                <small class="text-muted d-block">Total Deductions</small>
                                <strong id="calc_ded" class="h5 text-danger">£0.00</strong>
                            </div>
                        </div>
                        <div class="col-md-3 col-6">
                            <div class="calc-card text-center">
                                <small class="text-muted d-block">Tax (9%)</small>
                                <strong id="calc_taxable">£0.00</strong>
                            </div>
                        </div>
                        <div class="col-md-3 col-6">
                            <div class="calc-card text-center">
                                <small class="text-muted d-block">Pension (5.5%)</small>
                                <strong id="calc_pension">£0.00</strong>
                            </div>
                        </div>
                        <div class="col-md-3 col-6">
                            <div class="calc-card text-center">
                                <small class="text-muted d-block">Student Loan (2.5%)</small>
                                <strong id="calc_student">£0.00</strong>
                            </div>
                        </div>
                        <div class="col-md-3 col-6">
                            <div class="calc-card text-center">
                                <small class="text-muted d-block">NI (2.3%)</small>
                                <strong id="calc_ni">£0.00</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <h6 class="text-primary border-bottom pb-2 mb-3">
                        <i class="bi bi-sticky"></i> Additional Notes
                    </h6>
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label"><i class="bi bi-pencil-square"></i> Reference Note</label>
                            <textarea name="ref_note" id="ref_note" class="form-control" rows="3" placeholder="Add any additional notes or comments..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle"></i> Close
                </button>
                <button type="submit" class="btn btn-primary" id="modalSave">
                    <i class="bi bi-check-circle"></i> Save Employee
                </button>
            </div>
            </form>
            </div>
        </div>
    </div>

    <footer class="container mt-5 mb-3">
        <div class="text-center text-muted">
            <small>
                <i class="bi bi-c-circle"></i> 2024 Advanced Payroll System | 
                <i class="bi bi-shield-check"></i> Secure & Reliable | 
                <i class="bi bi-globe"></i> Version 3.0
            </small>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js.js"></script>
<!-- End of body and html -->
</body>
</html>