<?php
require_once('vendor/autoload.php');

define('PRODUCTION', 0);

if (!PRODUCTION)
{
  error_reporting(E_ALL);
  ini_set('display_errors','On');
}

function phoxy_conf()
{
  $ret = phoxy_default_conf();
  $ret["api_xss_prevent"] = PRODUCTION;

  return $ret;
}

function default_addons( $name )
{
  $ret =
  [
    "cache" => PRODUCTION ? ['global' => '10m'] : "no",
    "result" => "canvas",
  ];
  return $ret;
}

include('phoxy/phoxy_return_worker.php');
phoxy_return_worker::$add_hook_cb = function($that)
{
  global $USER_SENSITIVE;

  if ($USER_SENSITIVE)
    $that->obj['cache'] = 'no';
};






$rpc_string = $_SERVER['REQUEST_URI'];
if ($rpc_string == '/api/')
  $rpc_string = '/api/main/Home';

$_GET['api'] = $rpc_string;
include('phoxy/index.php');