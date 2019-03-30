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
   
  let hist_strings = []
  let alias_strings = []
  let options_strings = []

  const histfilesize=$("#history-file-size-input").val()
  const histsize=$("#history-size-input").val()
  // TODO all toogles for ignoredups etc
  
  if (histfilesize){
    hist_strings.push("export HISTFILESIZE="+histfilesize)
  }
  if (histfilesize){
    hist_strings.push("export HISTSIZE="+histsize)
  }

  if (hist_strings.length !=0){
    generated_results.push("# History Settings\n")
    generated_results.push(hist_strings.join("\n"))
  }
  ("#generated-bashrc").val(generated_results.join("\n"))
});
