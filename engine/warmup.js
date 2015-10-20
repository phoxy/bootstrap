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

    phoxy.state.early.optional.lazy = 4;
    phoxy.state.first_page = true;

    phoxy._.EarlyStage.EntryPoint();
  },
  OnBeforeCompile: function()
  {
    requirejs.config(
    {
      baseUrl: phoxy.config['js_dir'],
    });

    $(window).resize(function()
    {
      var width = $(window).width();
      var height = $(window).height();

      var ratio =  width / height;

      if (ratio > 16/5)
        $('body').addClass('extra');
      else
        $('body').removeClass('extra');

      if (ratio > 16/9)
        $('body').addClass('wide');
      else
        $('body').removeClass('wide');

      if (ratio < 4/5)
        $('body').addClass('mobile');
      else
        $('body').removeClass('mobile');

      if (width < 600)
        $('body').addClass('thin');
      else
        $('body').removeClass('thin');

      if (height < 600)
        $('body').addClass('short');
      else
        $('body').removeClass('short');


    }).trigger('resize');
  },
  OnAfterCompile: function()
  {
    phoxy.Config()['api_dir'] = '/' + phoxy.Config()['api_dir'];
    phoxy.Config()['ejs_dir'] = '/' + phoxy.Config()['ejs_dir'];
    phoxy.Config()['js_dir'] = '/' + phoxy.Config()['js_dir'];

    $('head').append
    (
      '<link rel="subresource" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.0.0/semantic.min.js">'
      + '<link rel="prefetch" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.0.0/semantic.min.js">'
    );

    var not_found = phoxy.ApiAnswer;
    phoxy.ApiAnswer = function(data)
    {
      if (data["error"] === 'Module not found'
          || data["error"] === "Unexpected RPC call (Module handler not found)")
      {
        $('.removeafterload').remove();
        return phoxy.ApiRequest("utils/page404");
      }
      return not_found.apply(this, arguments);
    }

    phoxy.Log(3, "Phoxy ready. Starting");
  },
  OnBeforeFirstApiCall: function()
  {
    requirejs.config({baseUrl: phoxy.Config()['js_dir']});

    // Enable jquery in EJS context
    var origin_hook = EJS.Canvas.prototype.hook_first;
    EJS.Canvas.prototype.hook_first = function()
    {
      return $(origin_hook.apply(this, arguments));
    }
  },
  OnInitialClientCodeComplete: function()
  {
    phoxy.Log(3, "Initial handlers complete");
    $('.removeafterload').remove();
    $('body').trigger('initialrender');
  }
  ,
  OnFirstPageRendered: function()
  {
    phoxy.Log(3, "First page rendered");
    phoxy.state.first_page = false;
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
  clearTimeout(require_not_loading);

  require(['/phoxy/phoxy.js'], function(){});
})();

var require_not_loading = setTimeout(function()
{
  var d = document;
  var js = d.createElement("script");
  js.type = "text/javascript";
  js.src = "//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.15/require.min.js";
  d.head.appendChild(js);

  console.log("Require loading timeout");
}, 5000);


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