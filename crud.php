<?php

class CRUD
{
    public $ini;
    public $db; // handle for database
    public $rows = [];

    /**
     * @method __construct
     * @param config_filename
     *     
     */
    public function __construct(string $config = "../config/config.json")
    {
        $this->ini = json_decode(\file_get_contents($config));
        if (!$this->ini || json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException('Invalid database configuration.');
        }
        $dsn = "mysql:dbname=" . $this->ini->database . ";host=" . $this->ini->host;
        $dsn = ($this->ini->port == 3306) ? $dsn : $dsn . ":" . $this->ini->port;
        $this->db = new \PDO($dsn, $this->ini->username, $this->ini->password);
        $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->db->setAttribute(\PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
        $this->ini->password = null;
    }

    private function identifier(string $value): string
    {
        if (!preg_match('/\\A[A-Za-z_][A-Za-z0-9_]*\\z/', $value)) {
            throw new \InvalidArgumentException("Invalid SQL identifier: {$value}");
        }

        return "`{$value}`";
    }

    /**
     * @method create
     * @param values
     * @param tablename
     *     
     * $create([
     *   col1 => value,
     *   col2 => value,
     *   col3 => value
     *   ], $table)
     */
    public function create(array $values, string $table)
    {
        if (!$values) {
            throw new \InvalidArgumentException('At least one value is required.');
        }

        $columns = array_map(fn($column) => $this->identifier((string) $column), array_keys($values));
        $placeholders = array_map(fn($index) => ":value{$index}", array_keys($values));
        $params = [];
        foreach (array_values($values) as $index => $value) {
            $params[":value{$index}"] = $value;
        }

        $sql = sprintf(
            'INSERT INTO %s (%s) VALUES (%s)',
            $this->identifier($table),
            implode(', ', $columns),
            implode(', ', $placeholders)
        );
        $db_ = $this->db->prepare($sql);
        $db_->execute($params);

        return 1;
    }

    /**
     * @method read
     * @param values
     * @param WHERE_clause
     * 
     * Use instruction:
     * $read([
     *  $table1 => [
     *      col1,
     *      col2,
     *      col3,
     *      ...,
     *      coln
     *      ]
     *  ], $where)
     */

    public function read(array $ta_ky, string $where)
    {
        if (!$ta_ky) {
            throw new \InvalidArgumentException('At least one table and column is required.');
        }

        $db_msg = "SELECT ";

        foreach ($ta_ky as $ta => $ky) {
            foreach ($ky as $key) {
                $db_msg .= $this->identifier((string) $ta) . "." . $this->identifier((string) $key) . ",";
            }
        }

        $db_msg = substr($db_msg, 0, strlen($db_msg) - 1);
        $db_msg .= " FROM ";
        foreach ($ta_ky as $ta => $ky) {
            $db_msg .= $this->identifier((string) $ta) . ", ";
        }
        $db_msg = substr($db_msg, 0, strlen($db_msg) - 2);
        $db_msg .= " WHERE $where";

        $db_ = $this->db->prepare($db_msg);
        $db_->execute() or die(print_r($db_->errorInfo(), true));
        $this->rows = $db_->fetchAll(\PDO::FETCH_BOTH);
        unset($db_);

        return $this->rows;
    }

    /**
     * @method update
     * @param table
     * @param values
     * @param WHERE_CLAUSE
     * 
     * Use:
     *  $update(
     *      $table,
     *      [
     *      key1 => value,
     *      key2 => value
     *      ],
     *      $where
     *  )
     */
    public function update(string $table, array $key_value, string $where)
    {
        if (!$key_value) {
            throw new \InvalidArgumentException('At least one update value is required.');
        }

        $assignments = [];
        $params = [];
        foreach ($key_value as $index => $pair) {
            $column = $this->identifier((string) $index);
            $position = count($params);
            $placeholder = ":update{$position}";
            $assignments[] = "{$column} = {$placeholder}";
            $params[$placeholder] = $pair;
        }

        $sql = sprintf('UPDATE %s SET %s WHERE %s', $this->identifier($table), implode(', ', $assignments), $where);
        $db_ = $this->db->prepare($sql);
        $db_->execute($params);

        return 1;
    }

    /**
     * @method delete
     * @param table
     * @param WHERE_CLAUSE
     * 
     * $delete($table,$where)
     */
    public function delete(string $table, string $where)
    {
        $db_msg = "DELETE FROM " . $this->identifier($table) . " WHERE $where";

        $db_ = $this->db->prepare($db_msg);
        $db_->execute() or die(print_r($db_->errorInfo(), true));

        return 1;
    }
}
?>
