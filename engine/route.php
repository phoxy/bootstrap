<?php
/* Purpose of this file: become independed of .htaccess rules
 * It simulate mod_rewrite, making same rules compatible to any system
 */

// calculate relative paths from document root
chdir(dirname(__FILE__)."/..");

function ParseURI($uri)
{
  @list($path, $qs) = explode("?", $uri, 2);
  parse_str($qs, $urlvars);

  return [$path, $urlvars];
}

list($request, $_GET) = ParseURI($_SERVER['REQUEST_URI']);

require('yaml_config.php');
$route = new yaml_config('route.yaml');

define('PRODUCTION', $route()->production);

if (!PRODUCTION)
{
  error_reporting(E_ALL);
  ini_set("display_errors", 1);
}


foreach ($route()->route as $route)
{
  $regexp = $route->url;

  $res = preg_match("/$regexp/", $request, $matches);

  if ($res === false)
    die("Issues at {$route->url} matching {$request}");

  if (!$res)
    continue;

  if (isset($route->script))
    break;

  if (isset($route->rewrite))
    $request = $route->rewrite;

  if (isset($route->static))
  {
    if ($route->static === true)
      $route->static = $request;

    $route->static = "./$route->static";
    if (!file_exists($route->static))
      header("HTTP/1.0 404 Not Found");
    else
    {
      $mtime = gmdate('D, d M Y H:i:s', filemtime($route->static));

      if (@getallheaders()['If-Modified-Since'] == $mtime)
      {
        header("HTTP/1.1 304 Not Modified");
        exit();
      }

      @header("Last-Modified: $mtime");
      @header('Cache-Control: public, max-age=600');

      if (!PRODUCTION || !isset($route->minify))
        readfile($route->static);
      else
      {
        $file = file_get_contents($route->static);
        echo \JShrink\Minifier::minify($file);
      }
    }
    exit();
  }

  if (isset($route->forbid))
    die("Request forbid for routing");
}

@header("Phoxy-Request: $request");
@header("Phoxy-Route: $route->script");
$_GET['api'] = $request;
require($route->script);
