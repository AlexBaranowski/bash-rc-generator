/* 
 * Please note that I'm not frontend developer. This code might be dead simple and verbose.
 * If you think that there is room for improvement - pull request are open ;).
*/
$( function() {
  $("#accordion").accordion();
  //disable toggles
  $('#history-append-checkbox').bootstrapToggle('off')  
  $('#history-shared-checkbox').bootstrapToggle('off')  
  $('#alias-popd-pushd-checkbox').bootstrapToggle('off')  
  $('#alias-cd-checkbox').bootstrapToggle('off')  

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
  // TODO use simple struct to connect -> (check_function(or value), && text) then loop through it,
  // Right now everything is checked with shitload of ifs, this soluion has same level of clarity but code is more compacted
  
  website_string="# Generated with bash.rc generator: https://TODO"
  generated_results=[website_string]
  
  // strings for toggles, easier to put the together then join
  const str_hist_append="shopt -s histappend"
  const str_shared_history=[str_hist_append, "export PROMPT_COMMAND=\"history -a; history -c; history -r; $PROMPT_COMMAND\""].join("\n")
  const str_super_pushd_popd=["alias cd=\"pushd\"", "alias back=\"popd\"", "popd()", "{", "  builtin popd > /dev/null", "}", "pushd()",
    "{", "  if [ $# -eq 0 ]; then", "    builtin pushd \"${HOME}\" > /dev/null", "  elif [ $1 == \"-\" ]; then",
    "      builtin popd > /dev/null", "  else", "    builtin pushd \"$1\" > /dev/null", "  fi", "}"].join("\n")
  const str_cd_aliases=["alias ..=\"cd ..\"", "alias ...=\"cd ../../../\"", "alias ....=\"cd ../../../../\"", 
  "alias .....=\"cd ../../../../\"", "alias .....=\"cd ../../../../\"" ].join("\n")
  const str_safer_aliases=["alias rm='rm -I --preserve-root'", "alias mv='mv -i'", "alias cp='cp -i'", "alias ln='ln -i'"].join("\n")
  const str_sudo_alias="alias sudo='sudo '"
  const str_alias_mkdir="alias mkdir=\"mkdir -pv\""
  const str_alias_vim="alias vi=\"vim\""
  const str_alias_greps=["alias grep='grep --color=auto'", "alias egrep='egrep --color=auto'", "alias fgrep='fgrep --color=auto'"].join("\n")
  const str_alias_colordiff="hash colordiff &> /dev/null && alias diff='colordiff'"
  const str_alias_now="alias now='date +\"%F-%T; %V week\"'"
  const str_alias_my_ip="alias my_ip='curl -s ifconfig.co/json | python3 -m json.tool'"

  // Each section has own string array.
  let hist_strings = []
  let alias_strings = []
  let options_strings = [] 
  // Get user inputs
  const histfilesize=$("#history-file-size-input").val()
  const histsize=$("#history-size-input").val()
  const histignore=$("#history-ignore-input").val()
  const histcontrol=$("#history-histcontrol-input").val()
  const histtimeformat=$("#history-time-format-input").val()
  const histfile=$("#history-file-input").val() 
  const enable_history_shared=$('#history-shared-checkbox').prop('checked')
  const enable_history_appending=$('#history-append-checkbox').prop('checked')
  const enable_alias_super_pushd_popd=$('#alias-popd-pushd-checkbox').prop('checked')//todo
  const enable_alias_cd=$('#alias-cd-checkbox').prop('checked')
  const enable_safer_aliases=$('#alias-safer-checkbox').prop('checked') // todo
  const enable_sudo_aliased=$('#alias-sudo-checkbox').prop('checked') // todo
  const enable_alias_mkdir=$('#alias-mkdir-checkbox').prop('checked')// todo
  const enable_alias_vim=$('#alias-vim-checkbox').prop('checked')// todo
  const enable_alias_greps=$('#alias-greps-checkbox').prop('checked')// todo
  const enable_alias_colordiff=$('#alias-colordiff-checkbox').prop('checked')// todo
  const enable_alias_now=$('#alias-colordiff-checkbox').prop('checked')// todo
  const enable_alias_my_ip=$('#alias-colordiff-checkbox').prop('checked')// todo
  
  //debug 
  // console.log("enable_history_appending - ", enable_history_appending)
  // console.log("enable_history_shared - ", enable_history_shared)
  // make proper bashrc entries 
  // history
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
 
  // aliases
  if ( enable_alias_super_pushd_popd ){
    alias_strings.push(str_super_pushd_popd)
  }
  if (enable_alias_cd){
    alias_strings.push(str_cd_aliases)
  }
  if (enable_safer_aliases){
    alias_strings.push(str_safer_aliases)
  }
  if (enable_sudo_aliased){
    alias_strings.push(str_sudo_alias)
  }
  if (enable_alias_mkdir){
    alias_strings.push(str_alias_mkdir)
  }
  if (enable_alias_vim){
    alias_strings.push(str_alias_vim)
  }
  if (enable_alias_greps){
    alias_strings.push(str_alias_greps)
  }
  if (enable_alias_colordiff){
    alias_strings.push(str_alias_greps)
  }
  if (enable_alias_now){
    alias_strings.push(str_alias_now)//fixme
  }
  if (enable_alias_my_ip){
    alias_strings.push(str_alias_my_ip)//fixme
  }
 
  
  
  
  
  if (hist_strings.length !=0){
    generated_results.push("# History Settings\n")
    generated_results.push(hist_strings.join("\n"))
  }
  if (alias_strings.length !=0){
    generated_results.push("# Aliases\n")
    generated_results.push(alias_strings.join("\n"))
  }
  if (options_strings.length !=0){
    generated_results.push("# Extra options\n")
    generated_results.push(options_strings.join("\n"))
  }
  $("#generated-bashrc").val(generated_results.join("\n"))
});
