<?php
/* Purpose of this file: become independed of .htaccess rules
 * It simulate mod_rewrite, making same rules compatible to any system
 */

function ParseURI($uri)
{
  list($path, $qs) = explode("?", $uri, 2);
  parse_str($qs, $urlvars);

  return [$path, $urlvars];
}

list($request, $_GET) = ParseURI($_SERVER['REQUEST_URI']);
$_GET['api'] = $request;

require('yaml_config.php');
$route = new yaml_config('../route.yaml');


foreach ($route()->route as $route)
{
  $regexp = $route->url;
  $res = preg_match("/$regexp/", $request, $matches);
  if ($res === false)
    die("Issues at {$route->url} matching {$request}");

  if (!$res)
    continue;

  break;
}

require("../".$route->script);
