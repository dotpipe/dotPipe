<?php

class CRUD
{
    public $ini;
    public $db; // handle for database

    /**
     * @method __construct
     * @param config_filename
     *     
     */
    public function __construct(string $config = "../config/config.json")
    {
        $this->ini = json_decode(\file_get_contents($config));
        $dsn = "mysql:dbname=" . $this->ini->database . ";host=" . $this->ini->host;
        $dsn = ($this->ini->port == 3306) ? $dsn : $dsn . ":" . $this->ini->port;
        $this->db = new \PDO($dsn, $this->ini->username, $this->ini->password);
        $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->db->setAttribute(\PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, "true");
        $this->ini->password = null;
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
        $db_msg = "INSERT INTO $table (";

        foreach ($values as $k => $v) {
            $db_msg .= $k . ","; 
        }

        $db_msg = substr($db_msg, 0, strlen($db_msg) - 1) . ") VALUES (";

        foreach ($values as $k => $v) {
            if (!is_string($v) && !\is_numeric($v)) {
                $db_msg .= "NULL,";
            } elseif (is_string($v)) {
                $db_msg .= "'" . $v . "',";
            } else {
                $db_msg .= $v . ",";
            }
        }

        $db_msg = substr($db_msg, 0, strlen($db_msg) - 1) . ")";
        $db_ = $this->db->prepare($db_msg);
        echo $db_msg;
        $db_->execute() or die(print_r($db_->errorInfo(), true));

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
        $db_msg = "SELECT ";

        foreach ($ta_ky as $ta => $ky) {
            foreach ($ky as $key) {
                $db_msg .= "`" . $ta . "`.`$key`,";
            }
        }

        $db_msg = substr($db_msg, 0, strlen($db_msg) - 1);
        $db_msg .= " FROM ";
        foreach ($ta_ky as $ta => $ky) {
            $db_msg .= "`$ta`, ";
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
        $db_msg = "UPDATE $table SET ";
        foreach ($key_value as $ky => $val) {
            if (is_numeric($val)) {
                $db_msg .= "`$table`.`$ky` = $val, ";
            } elseif (!is_numeric($val)) {
                $db_msg .= "`$table`.`$ky` = \"$val\", ";
            }
        }
        $db_msg = substr($db_msg, 0, strlen($db_msg) - 2);
        $db_msg .= " WHERE $where";
        $db_ = $this->db->prepare($db_msg);
        $db_->execute() or die(print_r($db_->errorInfo(), true));

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
        $db_msg = "DELETE FROM $table WHERE $where";

        $db_ = $this->db->prepare($db_msg);
        $db_->execute() or die(print_r($db_->errorInfo(), true));

        return 1;
    }
}
?>

<script>
function formJSONAJAX(elem, classname) {
    var elements = document.getElementsByClassName(classname);
    var data = {};

    for (var i = 0; i < elements.length; i++) {
        var elem = elements[i];
        
        var data_nest = {};
        var elem_count_base = elem.getAttribute("crud") + ";";
        // getting all FORM data with "crud" as an attr
        for (var j = 0; elem.hasAttribute("crud") && elem_count_base.length > 1; ) {
            var el_crud_calls = elem_count_base.split(";")
            
            // init map for holding temp variables
            var map = {}
            for (var element of el_crud_calls) {
                var all_crud = element.getAttribute('crud')
                var el_id = (all_crud.contains("?")) ? all_crud.split('?') : ""
                var el_crud_id = (el_id[0].length > 0) ? map.push({"id": el_id[0]}) : "NULL"
                var el_key_value = el_id[1].split('@')
                var insert = (el_key_value[1].contains("."))
                for (var kv of el_key_value) {
                    var key = kv.split(":")[0]
                    var val = kv.split(":")[1]
                    map.push({ key: val })
                    map.push({ "insert": insert })
                }

                data_nest[j].push(map)
                map = {}
                j++;
            }
        }

        if (data_nest.length > 0)
            data.push(data_nest);

        var name = elem.name;
        var value = elem.value;

        // Handle multiple select boxes
        if (elem.multiple) {
            data[name] = [];
            for (var o of elem.options) {
                if (o.selected) {
                    data[name].push(o.value);
                }
            }
        } else {
            data[name] = value;
        }
    }
    // Convert the data object to a JSON string
    var jsonString = JSON.stringify(data, null, 2);
    return jsonString;
}
</script>