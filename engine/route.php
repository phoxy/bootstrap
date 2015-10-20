<?php
/* Purpose of this file: become independed of .htaccess rules
 * It simulate mod_rewrite, making same rules compatible to any system
 */

require('config.php');

$route = new config('../route.yaml');
var_dump($route()->route);