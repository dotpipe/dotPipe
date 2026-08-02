<?php
header('Content-Type: text/html; charset=utf-8');
echo '<div class="fragment-live"><span class="fragment-dot"></span><strong>XI fragment connected</strong><time>' . htmlspecialchars(gmdate('H:i:s') . ' UTC', ENT_QUOTES, 'UTF-8') . '</time></div>';
