/*
 * Vanilla JS — no jQuery dependency.
 * Pull requests welcome: https://github.com/AlexBaranowski/bash-rc-generator
 */

// Utilities
const el  = (id) => document.getElementById(id);
const val = (id) => el(id).value;
const chk = (id) => el(id).checked;
// set() dispatches 'input' so live-preview picks up example-button clicks automatically
const set = (id, v) => { el(id).value = v; el(id).dispatchEvent(new Event('input')); };
const on  = (id, fn) => el(id).addEventListener('click', fn);

// ── History example buttons ──────────────────────────────────────────────────
on('history-file-size-example',  () => set('history-file-size-input', '2000'));
on('history-size-example',       () => set('history-size-input', '2000'));
on('history-ignore-example',     () => set('history-ignore-input', 'cd*:false:history:htop:ls*:ll*:la:l:popd:pushd*:reset:top:true'));
on('history-histcontrol-example-none',        () => set('history-histcontrol-input', ''));
on('history-histcontrol-example-ignoreboth',  () => set('history-histcontrol-input', 'ignoreboth'));
on('history-histcontrol-example-ignorespace', () => set('history-histcontrol-input', 'ignorespace'));
on('history-histcontrol-example-ignoredups',  () => set('history-histcontrol-input', 'ignoredups'));
on('history-histcontrol-example-erasedups',   () => set('history-histcontrol-input', 'erasedups'));
on('history-time-format-example', () => set('history-time-format-input', '%Y-%m-%d %T '));
on('history-file-example',        () => set('history-file-input', '~/.my_bash_history'));

// ── Options example buttons ──────────────────────────────────────────────────
on('options-editor-none',  () => set('options-editor-input', ''));
on('options-editor-vi',    () => set('options-editor-input', 'vi'));
on('options-editor-vim',   () => set('options-editor-input', 'vim'));
on('options-editor-nano',  () => set('options-editor-input', 'nano'));
on('options-pager-none',   () => set('options-pager-input', ''));
on('options-pager-less',   () => set('options-pager-input', 'less'));
on('options-pager-most',   () => set('options-pager-input', 'most'));
on('options-logout-timer-example', () => set('options-logout-timer-input', '3600'));
on('options-ignore-eofs-example',  () => set('options-ignore-eofs-input', '2'));

// ── Generate ─────────────────────────────────────────────────────────────────
function generateBashrc() {
    const generated_results = [
        '# Generated with bashrc generator: https://alexbaranowski.github.io/bash-rc-generator/'
    ];

    // Output string constants
    const str_hist_append     = 'shopt -s histappend';
    const str_shared_history  = [
        str_hist_append,
        'export PROMPT_COMMAND="history -a; history -c; history -r; $PROMPT_COMMAND"'
    ].join('\n');
    const str_super_pushd_popd = [
        'alias cd="pushd"', 'alias back="popd"',
        'popd()', '{', '  builtin popd > /dev/null', '}',
        'pushd()', '{',
        '  if [ $# -eq 0 ]; then', '    builtin pushd "${HOME}" > /dev/null',
        '  elif [ $1 == "-" ]; then', '      builtin popd > /dev/null',
        '  else', '    builtin pushd "$1" > /dev/null',
        '  fi', '}'
    ].join('\n');
    const str_cd_aliases      = ['alias ..="cd .."', 'alias ...="cd ../../../"', 'alias ....="cd ../../../../"', 'alias .....="cd ../../../../"'].join('\n');
    const str_safer_aliases   = ["alias rm='rm -I --preserve-root'", "alias mv='mv -i'", "alias cp='cp -i'", "alias ln='ln -i'"].join('\n');
    const str_sudo_alias      = "alias sudo='sudo '";
    const str_alias_mkdir     = 'alias mkdir="mkdir -pv"';
    const str_alias_vim       = 'alias vi="vim"';
    const str_alias_greps     = ["alias grep='grep --color=auto'", "alias egrep='egrep --color=auto'", "alias fgrep='fgrep --color=auto'"].join('\n');
    const str_alias_colordiff = "hash colordiff &> /dev/null && alias diff='colordiff'";
    const str_alias_pbcopy    = ['alias pbcopy="xclip -selection c"', 'alias pbpaste="xclip -selection clipboard -o"'].join('\n');
    const str_alias_now       = 'alias now=\'date +"%F-%T; %V week"\'';
    const str_alias_my_ip     = "alias my_ip='curl -s ifconfig.co/json | python3 -m json.tool'";
    const str_checkwinsize    = 'shopt -s checkwinsize';
    const str_mesg_n          = 'mesg n';

    // Read inputs
    const histfilesize = val('history-file-size-input');
    const histsize     = val('history-size-input');
    const histignore   = val('history-ignore-input');
    const histcontrol  = val('history-histcontrol-input');
    const histtimefmt  = val('history-time-format-input');
    const histfile     = val('history-file-input');
    const hist_shared  = chk('history-shared-checkbox');
    const hist_append  = chk('history-append-checkbox');

    const opt_editor       = val('options-editor-input');
    const opt_pager        = val('options-pager-input');
    const opt_logout       = val('options-logout-timer-input');
    const opt_mesg_n       = chk('options-mesg-n-checkbox');
    const opt_checkwin     = chk('options-checkwinsize-checkbox');
    const opt_ignore_eofs  = val('options-ignore-eofs-input');

    // [condition, output-string] pairs
    const hist_pairs = [
        [histfilesize, `export HISTFILESIZE=${histfilesize}`],
        [histsize,     `export HISTSIZE=${histsize}`],
        [histignore,   `export HISTIGNORE="${histignore}"`],
        [histcontrol,  `export HISTCONTROL="${histcontrol}"`],
        [histtimefmt,  `export HISTTIMEFORMAT="${histtimefmt}"`],
        [histfile,     `export HISTFILE="${histfile}"`],
    ];
    const alias_pairs = [
        [chk('alias-popd-pushd-checkbox'),    str_super_pushd_popd],
        [chk('alias-cd-checkbox'),            str_cd_aliases],
        [chk('alias-safer-checkbox'),         str_safer_aliases],
        [chk('alias-sudo-checkbox'),          str_sudo_alias],
        [chk('alias-mkdir-checkbox'),         str_alias_mkdir],
        [chk('alias-vim-checkbox'),           str_alias_vim],
        [chk('alias-greps-checkbox'),         str_alias_greps],
        [chk('alias-colordiff-checkbox'),     str_alias_colordiff],
        [chk('alias-copy-and-paste-checkbox'),str_alias_pbcopy],
        [chk('alias-now-checkbox'),           str_alias_now],
        [chk('alias-my-ip-checkbox'),         str_alias_my_ip],
    ];
    const option_pairs = [
        [opt_editor,   [`export EDITOR="${opt_editor}"`, `export VISUAL="${opt_editor}"`].join('\n')],
        [opt_pager,    `export PAGER="${opt_pager}"`],
        [opt_logout,   `export TMOUT="${opt_logout}"`],
        [opt_mesg_n,   str_mesg_n],
        [opt_checkwin, str_checkwinsize],
        [opt_ignore_eofs, `export IGNOREEOF=${opt_ignore_eofs}`],
    ];

    const hist_strings   = hist_pairs.filter(([c]) => c).map(([, v]) => v);
    const alias_strings  = alias_pairs.filter(([c]) => c).map(([, v]) => v);
    const option_strings = option_pairs.filter(([c]) => c).map(([, v]) => v);

    // histappend / shared history are special cases
    if (hist_shared) {
        hist_strings.push(str_shared_history);
    } else if (hist_append) {
        hist_strings.push(str_hist_append);
    }

    if (hist_strings.length > 0) {
        generated_results.push('\n# History Settings');
        generated_results.push(hist_strings.join('\n'));
    }
    if (alias_strings.length > 0) {
        generated_results.push('\n# Aliases');
        generated_results.push(alias_strings.join('\n'));
    }
    if (option_strings.length > 0) {
        generated_results.push('\n# Extra options');
        generated_results.push(option_strings.join('\n'));
    }

    el('generated-bashrc').value = generated_results.join('\n');
}

// ── Live preview ─────────────────────────────────────────────────────────────
// Re-generate whenever any input or checkbox changes
const livePreviewIds = [
    'history-file-size-input', 'history-size-input', 'history-ignore-input',
    'history-histcontrol-input', 'history-time-format-input', 'history-file-input',
    'history-append-checkbox', 'history-shared-checkbox',
    'alias-popd-pushd-checkbox', 'alias-cd-checkbox', 'alias-safer-checkbox',
    'alias-sudo-checkbox', 'alias-mkdir-checkbox', 'alias-vim-checkbox',
    'alias-greps-checkbox', 'alias-colordiff-checkbox', 'alias-copy-and-paste-checkbox',
    'alias-now-checkbox', 'alias-my-ip-checkbox',
    'options-editor-input', 'options-pager-input', 'options-logout-timer-input',
    'options-mesg-n-checkbox', 'options-checkwinsize-checkbox', 'options-ignore-eofs-input',
];
livePreviewIds.forEach(id => {
    el(id).addEventListener('input',  generateBashrc);
    el(id).addEventListener('change', generateBashrc);
});

// ── Copy to clipboard ────────────────────────────────────────────────────────
on('copy-button', function () {
    const text = el('generated-bashrc').value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const btn = el('copy-button');
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.replace('btn-warning', 'btn-success');
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.replace('btn-success', 'btn-warning');
        }, 2000);
    });
});

// ── Download ─────────────────────────────────────────────────────────────────
on('download-button', function () {
    const text = el('generated-bashrc').value;
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = '.bashrc';
    a.click();
    URL.revokeObjectURL(url);
});

// ── Initial render ───────────────────────────────────────────────────────────
generateBashrc();
