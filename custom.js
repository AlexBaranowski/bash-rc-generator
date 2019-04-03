/* 
 * Please note that I'm not frontend developer. This code might be dead simple and verbose.
 * If you think that there is room for improvement, well pull request are open ;).
*/

$(function () {
    $("#accordion").accordion()
    $('input[type=checkbox]').bootstrapToggle('off')
});
// History
$("#history-file-size-example").click(function () {
    $("#history-file-size-input").val("2000")
});
$("#history-size-example").click(function () {
    $("#history-size-input").val("2000")
});
$("#history-histcontrol-example-none").click(function () {
    $("#history-histcontrol-input").val("")
});
$("#history-ignore-example").click(function () {
    $("#history-ignore-input").val("cd*:false:history:htop:ls*:ll*:la:l:popd:pushd*:reset:top:true")
});
$("#history-histcontrol-example-ignoreboth").click(function () {
    $("#history-histcontrol-input").val("ignoreboth")
});
$("#history-histcontrol-example-ignorespace").click(function () {
    $("#history-histcontrol-input").val("ignorespace")
});
$("#history-histcontrol-example-ignoredups").click(function () {
    $("#history-histcontrol-input").val("ignoredups")
});
$("#history-histcontrol-example-erasedups").click(function () {
    $("#history-histcontrol-input").val("erasedups")
});
$("#history-time-format-example").click(function () {
    $("#history-time-format-input").val("%Y-%m-%d %T ")
});
$("#history-file-example").click(function () {
    $("#history-file-input").val("~/.my_bash_history")
});
//Extra options
$("#options-editor-none").click(function () {
    $("#options-editor-input").val("")
});
$("#options-editor-vi").click(function () {
    $("#options-editor-input").val("vi")
});
$("#options-editor-vim").click(function () {
    $("#options-editor-input").val("vim")
});
$("#options-editor-nano").click(function () {
    $("#options-editor-input").val("nano")
});
$("#options-pager-none").click(function () {
    $("#options-pager-input").val("")
});
$("#options-pager-less").click(function () {
    $("#options-pager-input").val("less")
});
$("#options-pager-most").click(function () {
    $("#options-pager-input").val("most")
});
$("#options-pager-most").click(function () {
    $("#options-pager-input").val("most")
});
$("#options-logout-timer-example").click(function () {
    $("#options-logout-timer-input").val("3600")
});
$("#options-logout-timer-example").click(function () {
    $("#options-logout-timer-input").val("3600")
});
$("#options-ignore-eofs-example").click(function () {
    $("#options-ignore-eofs-input").val("2")
});


// Generting the bashrc
$("#generate-button").click(function () {
    
    website_string = "# Generated with bashrc generator: https://alexbaranowski.github.io/bash-rc-generator/"
    generated_results = [website_string]

    // strings for toggles, easier to put the together, then join
    const str_hist_append = "shopt -s histappend"
    const str_shared_history = [str_hist_append, "export PROMPT_COMMAND=\"history -a; history -c; history -r; $PROMPT_COMMAND\""].join("\n")
    const str_super_pushd_popd = ["alias cd=\"pushd\"", "alias back=\"popd\"", "popd()", "{", "  builtin popd > /dev/null", "}", "pushd()",
        "{", "  if [ $# -eq 0 ]; then", "    builtin pushd \"${HOME}\" > /dev/null", "  elif [ $1 == \"-\" ]; then",
        "      builtin popd > /dev/null", "  else", "    builtin pushd \"$1\" > /dev/null", "  fi", "}"].join("\n")
    const str_cd_aliases = ["alias ..=\"cd ..\"", "alias ...=\"cd ../../../\"", "alias ....=\"cd ../../../../\"",
        "alias .....=\"cd ../../../../\"", "alias .....=\"cd ../../../../\""].join("\n")
    const str_safer_aliases = ["alias rm='rm -I --preserve-root'", "alias mv='mv -i'", "alias cp='cp -i'", "alias ln='ln -i'"].join("\n")
    const str_sudo_alias = "alias sudo='sudo '"
    const str_alias_mkdir = "alias mkdir=\"mkdir -pv\""
    const str_alias_vim = "alias vi=\"vim\""
    const str_alias_greps = ["alias grep='grep --color=auto'", "alias egrep='egrep --color=auto'", "alias fgrep='fgrep --color=auto'"].join("\n")
    const str_alias_colordiff = "hash colordiff &> /dev/null && alias diff='colordiff'"
    const str_alias_pbcopy_pbpaste = ["alias pbcopy=\"xclip -selection c\"", "alias pbpaste=\"xclip -selection clipboard -o\""].join("\n")
    const str_alias_now = "alias now='date +\"%F-%T; %V week\"'"
    const str_alias_my_ip = "alias my_ip='curl -s ifconfig.co/json | python3 -m json.tool'"
    const str_option_checkwinsize = "shopt -s checkwinsize"
    const str_option_disable_messages = "mesg n"

    // Each section has own string array.
    let hist_strings = []
    let alias_strings = []
    let options_strings = []
    // Get user inputs
    const histfilesize = $("#history-file-size-input").val()
    const histsize = $("#history-size-input").val()
    const histignore = $("#history-ignore-input").val()
    const histcontrol = $("#history-histcontrol-input").val()
    const histtimeformat = $("#history-time-format-input").val()
    const histfile = $("#history-file-input").val()
    const enable_history_shared = $('#history-shared-checkbox').prop('checked')
    const enable_history_appending = $('#history-append-checkbox').prop('checked')
    const enable_alias_super_pushd_popd = $('#alias-popd-pushd-checkbox').prop('checked')
    const enable_alias_cd = $('#alias-cd-checkbox').prop('checked')
    const enable_safer_aliases = $('#alias-safer-checkbox').prop('checked')
    const enable_sudo_aliased = $('#alias-sudo-checkbox').prop('checked')
    const enable_alias_mkdir = $('#alias-mkdir-checkbox').prop('checked')
    const enable_alias_vim = $('#alias-vim-checkbox').prop('checked')
    const enable_alias_greps = $('#alias-greps-checkbox').prop('checked')
    const enable_alias_colordiff = $('#alias-colordiff-checkbox').prop('checked')
    const enable_alias_copy_paste = $('#alias-copy-and-paste-checkbox').prop('checked')
    const enable_alias_now = $('#alias-now-checkbox').prop('checked')
    const enable_alias_my_ip = $('#alias-my-ip-checkbox').prop('checked')

    const option_editor = $("#options-editor-input").val()
    const option_pager = $("#options-pager-input").val()
    const option_auto_logout = $("#options-logout-timer-input").val()
    const option_disable_messages = $("#options-mesg-n-checkbox").prop('checked')
    const option_checkwinsize = $("#options-checkwinsize-checkbox").prop('checked')
    const option_ignore_eofs = $("#options-ignore-eofs-input").val()

    //Tables has tables where first item is "condition"(in sTrAnGe JS way) and second is the value.
    hist = [[histfilesize, "export HISTFILESIZE=" + histfilesize], [histsize, "export HISTSIZE=" + histsize],
        [histignore, "export HISTIGNORE=\"" + histignore + "\""], [histcontrol, "export HISTCONTROL=\"" + histcontrol + "\""],
        [histtimeformat, "export HISTTIMEFORMAT=\"" + histtimeformat + "\""], [histfile, "export HISTFILE=\"" + histfile + "\""]
    ];
    aliases = [[enable_alias_super_pushd_popd, str_super_pushd_popd], [enable_alias_cd, str_cd_aliases],
        [enable_safer_aliases, str_safer_aliases], [enable_sudo_aliased, str_sudo_alias], [enable_alias_mkdir, str_alias_mkdir],
        [enable_alias_vim, str_alias_vim], [enable_alias_greps, str_alias_greps], [enable_alias_colordiff, str_alias_colordiff],
        [enable_alias_copy_paste, str_alias_pbcopy_pbpaste], [enable_alias_now, str_alias_now], [enable_alias_my_ip, str_alias_my_ip]]

    options=[[option_editor, ["export EDITOR=\"" + option_editor + "\"", "export VISUAL=\"" + option_editor + "\""].join('\n')],
        [option_pager, "export PAGER=\"" + option_pager + "\""], [option_auto_logout,"export TMOUT=\"" + option_auto_logout + "\"" ],
        [option_disable_messages, str_option_disable_messages], [option_checkwinsize, str_option_checkwinsize], [option_ignore_eofs, "export IGNOREEOF=" + option_ignore_eofs]]
    for (var i = 0; i < hist.length; i++) {
        if (hist[i][0]) {
            hist_strings.push(hist[i][1])
        }
    }
    for (var i = 0; i < aliases.length; i++) {
        if (aliases[i][0]) {
            alias_strings.push(aliases[i][1])
        }
    }
    for (var i = 0; i < options.length; i++) {
        if (options[i][0]) {
            options_strings.push(options[i][1])
        }
    }

    // Special cases
    if (enable_history_shared) {
        hist_strings.push(str_shared_history)
    } else if (enable_history_appending) {
        hist_strings.push(str_hist_append)
    }


    if (hist_strings.length != 0) {
        generated_results.push("# History Settings\n")
        generated_results.push(hist_strings.join("\n"))
    }
    if (alias_strings.length != 0) {
        generated_results.push("\n# Aliases")
        generated_results.push(alias_strings.join("\n"))
    }
    if (options_strings.length != 0) {
        generated_results.push("# Extra options\n")
        generated_results.push(options_strings.join("\n"))
    }
    $("#generated-bashrc").val(generated_results.join("\n"))
});
