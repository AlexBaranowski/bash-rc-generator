/* 
 * Please note that I'm not frontend developer. This code might be dead simple and verbose.
 * If you think that there is room for improvement - pull request are open ;).
*/
$( function() {
  $("#accordion").accordion();
  //disable toggles
  $('#history-append-checkbox').bootstrapToggle('off')  
  $('#history-shared-checkbox').bootstrapToggle('off')  

});
// History
$( "#history-file-size-example" ).click(function() {
  $("#history-file-size-input").val("2000")
});
$( "#history-size-example" ).click(function() {
  $("#history-size-input").val("2000")
});
// There might be smarter way to set this with name of id, but 
$( "#history-histcontrol-example-none" ).click(function() {
  $("#history-histcontrol-input").val("")
});
$( "#history-ignore-example" ).click(function() {
  $("#history-ignore-input").val("cd*:false:history:htop:ls*:ll*:la:l:popd:pushd*:reset:top:true")
});
$( "#history-histcontrol-example-ignoreboth" ).click(function() {
  $("#history-histcontrol-input").val("ignoreboth")
});
$( "#history-histcontrol-example-ignorespace" ).click(function() {
  $("#history-histcontrol-input").val("ignorespace")
});
$( "#history-histcontrol-example-ignoredups" ).click(function() {
  $("#history-histcontrol-input").val("ignoredups")
});
$( "#history-histcontrol-example-erasedups" ).click(function() {
  $("#history-histcontrol-input").val("erasedups")
});
$( "#history-time-format-example" ).click(function() {
  $("#history-time-format-input").val("%Y-%m-%d %T ")
});
$( "#history-file-example" ).click(function() {
  $("#history-file-input").val("~/.my_bash_history")
});

// Generting the bashrc
$( "#generate-button" ).click(function() {
  website_string="# Generated with bash.rc generator: https://TODO"
  generated_results=[website_string]
  
  // strings for toggles, easier to put the together then join
  const str_hist_append="shopt -s histappend"
  const str_shared_history=[str_hist_append, "export PROMPT_COMMAND=\"history -a; history -c; history -r; $PROMPT_COMMAND\""].join("\n")
 
  // Each section has own string array.
  let hist_strings = []
  let alias_strings = []
  let options_strings = [] 
  // Get user inputs
  const histfilesize=$("#history-file-size-input").val()
  const histsize=$("#history-size-input").val()
  const histignore=$("#history-ignore-input").val()
  const histcontrol=$("#history-histcontrol-input").val()
  const histtimeformat=$("#history-time-format-input").val()//todo
  const histfile=$("#history-file-input").val() //todo
  const enable_history_shared=$('#history-shared-checkbox').prop('checked')//todo
  const enable_history_appending=$('#history-append-checkbox').prop('checked')//todo
  
  //debug 
  // console.log("enable_history_appending - ", enable_history_appending)
  // console.log("enable_history_shared - ", enable_history_shared)

  // make proper bashrc entries 
  if (histfilesize){
    hist_strings.push("export HISTFILESIZE="+histfilesize)
  }
  if (histfilesize){
    hist_strings.push("export HISTSIZE="+histsize)
  }
  if (histignore){
    hist_strings.push("export HISTIGNORE=\""+histignore+"\"")
  }
  if (histcontrol){
    hist_strings.push("export HISTCONTROL=\""+histcontrol+"\"")
  }
  if (histtimeformat){
    hist_strings.push("export HISTTIMEFORMAT=\""+histtimeformat+"\"")
  }
  if (histfile){
    hist_strings.push("export HISTFILE=\""+histfile+"\"")
  }

  if (enable_history_shared){
    hist_strings.push(str_shared_history)
  }else if (enable_history_appending){
    hist_strings.push(str_hist_append)
  }

  if (hist_strings.length !=0){
    generated_results.push("# History Settings\n")
    generated_results.push(hist_strings.join("\n"))
  }
  $("#generated-bashrc").val(generated_results.join("\n"))
});
