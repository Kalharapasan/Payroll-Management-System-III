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
        $taxable = ($gross * 9) / 100.0; // 9%
        $pension = ($gross * 5.5) / 100.0; // 5.5%
        $student = ($gross * 2.5) / 100.0; // 2.5%
        $ni = ($gross * 2.3) / 100.0; // 2.3%
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
        ];
    }


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>