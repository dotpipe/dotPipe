<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="dot.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            max-width: 25;
            display: flex;
            flex-direction: column;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
        }
        #arrow-area {
            flex: 1;
            margin: 100px;
            color: black;
        }
        #collective-container {
            position: fixed;
            bottom: 0;
            border-top-right-radius: 25px;
            left: 0;
            top:50vh;
            height: 100%;
            width: 25px;
            background-color: darkblue;
            color: white;
            padding: 10px;
            text-align: left;
        }
        .arrow {
            position:absolute;
            color:blue;
            height:25;
            width:10;
        }
    </style>
</head>
<body>
    <div id="arrow-area">
        <!-- Your main content goes here -->
    </div>
    
    <div id="collective-container">
        <div id="collective-content"></div>
    </div>

    <script>
        try {
            modal("./draft.json", "collective-content");
        }
        catch(e) {
            console.log(e);
        }
    </script>
</body>
</html>
