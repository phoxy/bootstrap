<?php

if (!function_exists('getallheaders'))
{ // http://php.net/manual/en/function.getallheaders.php#84262
  function getallheaders()
  {
    $headers = [];
    foreach ($_SERVER as $name => $value)
      if (substr($name, 0, 5) == 'HTTP_')
        $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;

    return $headers;
  }
}

if (!function_exists('mime_content_type') && class_exists('finfo'))
{ // http://stackoverflow.com/questions/1263957/why-is-mime-content-type-deprecated-in-php
  function mime_content_type($filename)
  {
    $result = new finfo();

    if (is_resource($result) === true)
      return $result->file($filename, FILEINFO_MIME_TYPE);

    return false;
  }
}
