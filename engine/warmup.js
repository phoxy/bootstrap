var warmup_obj =
{
  wait: true,
  config: "/api/phoxy",
  skip_initiation: true,
  sync_cascade: true,
  OnWaiting: function()
  {
    phoxy._.EarlyStage.sync_require[0] = "/enjs.js";
    phoxy._.EarlyStage.sync_require.push("//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js");
    phoxy._.EarlyStage.EntryPoint();
  },
  OnBeforeCompile: function()
  {
    requirejs.config(
    {
      baseUrl: phoxy.config['js_dir'],
    });
  },
  OnAfterCompile: function()
  {
    phoxy.Config()['api_dir'] = '/' + phoxy.Config()['api_dir'];
    phoxy.Config()['ejs_dir'] = '/' + phoxy.Config()['ejs_dir'];
    phoxy.Config()['js_dir'] = '/' + phoxy.Config()['js_dir'];

    phoxy.Override('ApiAnswer', function not_found(data)
    { // 404 page overriding example
      if (data["error"] === 'Module not found'
          || data["error"] === "Unexpected RPC call (Module handler not found)")
      {
        $('.removeafterload').remove();
        return phoxy.ApiRequest("utils/page404");
      }
      return this.origin.apply(this, arguments);
    })

    phoxy.Log(3, "Phoxy ready. Starting");
  },
  OnBeforeFirstApiCall: function()
  {
    requirejs.config({baseUrl: phoxy.Config()['js_dir']});

    // Enable jquery in EJS context
    var origin_hook = EJS.Canvas.prototype.hook_first;
    EJS.Canvas.prototype.hook_first = function jquery_hook_first()
    {
      return $(origin_hook.apply(this, arguments));
    }
  },
  OnInitialClientCodeComplete: function()
  {
    phoxy.Log(3, "Initial handlers complete");
    $('.removeafterload').remove();
  }
  ,
  OnFirstPageRendered: function()
  {
    phoxy.Log(3, "First page rendered");
  }
};

if (typeof phoxy.prestart === 'undefined')
  phoxy = warmup_obj;
else
{
  phoxy.prestart = warmup_obj;
  phoxy.prestart.OnWaiting();
}

(function()
{
  if (typeof require === 'undefined')
    return setTimeout(arguments.callee, 50);

  require(['/phoxy/phoxy.js'], function(){});
})();


// Loading animation
(function()
{
  if (typeof phoxy._ == 'undefined')
    return setTimeout(arguments.callee, 10);

  var percents = phoxy._.EarlyStage.LoadingPercentage();
  var element = document.getElementById('percent');

  if (element == null)
    return;
  element.style.width = percents + "px";
  element.style.opacity = percents / 100 + 0.5;
  setTimeout(arguments.callee, 50);

  if (percents == 100)
    $('.removeafterload').css('opacity', 0);
})();