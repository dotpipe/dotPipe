<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>dotPipe JSON Tree</title>
    <script src="dotPipe.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #1e1e1e;
            color: #fff;
            padding: 20px;
        }
        .tree-item {
            margin-left: 20px;
            cursor: pointer;
        }
        .highlight {
            background-color: #333;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>JSON Directory Tree</h1>
    <dotPipe id="jsonTree"></dotPipe>

    <script>
        const jsonData = {
            "root": {
                "folder1": {
                    "file1": "value1",
                    "file2": "value2"
                },
                "folder2": {
                    "subfolder": {
                        "file3": "value3"
                    }
                }
            }
        };

        function renderTree(obj, parentElement) {
            Object.entries(obj).forEach(([key, value]) => {
                let item = document.createElement('dotPipe');
                item.setAttribute('dp-tag', 'div');
                item.setAttribute('dp-text', key);
                item.classList.add('tree-item');
                
                if (typeof value === 'object') {
                    let subContainer = document.createElement('dotPipe');
                    subContainer.setAttribute('dp-tag', 'div');
                    subContainer.classList.add('sub-tree');
                    renderTree(value, subContainer);
                    item.appendChild(subContainer);
                } else {
                    item.setAttribute('dp-text', `${key}: ${value}`);
                }

                parentElement.appendChild(item);

                item.addEventListener('click', () => {
                    item.classList.toggle('highlight');
                });
            });
        }

        const treeContainer = document.getElementById('jsonTree');
        renderTree(jsonData, treeContainer);
    </script>
</body>
</html>
