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

// ── localStorage persistence ─────────────────────────────────────────────────
const STORAGE_KEY = 'bashrc-generator-v1';

const persistableFields = [
    // text / number inputs
    { id: 'history-file-size-input',         type: 'value'   },
    { id: 'history-size-input',              type: 'value'   },
    { id: 'history-ignore-input',            type: 'value'   },
    { id: 'history-histcontrol-input',       type: 'value'   },
    { id: 'history-time-format-input',       type: 'value'   },
    { id: 'history-file-input',              type: 'value'   },
    { id: 'options-editor-input',            type: 'value'   },
    { id: 'options-pager-input',             type: 'value'   },
    { id: 'options-logout-timer-input',      type: 'value'   },
    { id: 'options-ignore-eofs-input',       type: 'value'   },
    // checkboxes
    { id: 'history-append-checkbox',         type: 'checked' },
    { id: 'history-shared-checkbox',         type: 'checked' },
    { id: 'alias-popd-pushd-checkbox',       type: 'checked' },
    { id: 'alias-cd-checkbox',               type: 'checked' },
    { id: 'alias-safer-checkbox',            type: 'checked' },
    { id: 'alias-sudo-checkbox',             type: 'checked' },
    { id: 'alias-mkdir-checkbox',            type: 'checked' },
    { id: 'alias-vim-checkbox',              type: 'checked' },
    { id: 'alias-greps-checkbox',            type: 'checked' },
    { id: 'alias-colordiff-checkbox',        type: 'checked' },
    { id: 'alias-copy-and-paste-checkbox',   type: 'checked' },
    { id: 'alias-now-checkbox',              type: 'checked' },
    { id: 'alias-my-ip-checkbox',            type: 'checked' },
    { id: 'options-mesg-n-checkbox',         type: 'checked' },
    { id: 'options-checkwinsize-checkbox',   type: 'checked' },
    // prompt builder
    { id: 'prompt-username-checkbox',        type: 'checked' },
    { id: 'prompt-hostname-checkbox',        type: 'checked' },
    { id: 'prompt-directory-checkbox',       type: 'checked' },
    { id: 'prompt-exitcode-checkbox',        type: 'checked' },
    { id: 'prompt-time-checkbox',            type: 'checked' },
    { id: 'prompt-symbol-root-checkbox',     type: 'checked' },
    { id: 'prompt-newline-checkbox',         type: 'checked' },
    { id: 'prompt-time-format',              type: 'value'   },
    { id: 'prompt-symbol-input',             type: 'value'   },
    { id: 'prompt-color-username',           type: 'value'   },
    { id: 'prompt-color-hostname',           type: 'value'   },
    { id: 'prompt-color-directory',          type: 'value'   },
    { id: 'prompt-separator-main',           type: 'value'   },
    { id: 'prompt-separator-path',           type: 'value'   },
    // advanced - PATH
    { id: 'path-prepend-input',              type: 'value'   },
    { id: 'path-append-input',               type: 'value'   },
    // advanced - shopt
    { id: 'shopt-globstar-checkbox',         type: 'checked' },
    { id: 'shopt-extglob-checkbox',          type: 'checked' },
    { id: 'shopt-nocaseglob-checkbox',       type: 'checked' },
    { id: 'shopt-autocd-checkbox',           type: 'checked' },
    { id: 'shopt-cdspell-checkbox',          type: 'checked' },
    { id: 'shopt-dirspell-checkbox',         type: 'checked' },
    { id: 'shopt-dotglob-checkbox',          type: 'checked' },
    { id: 'shopt-nullglob-checkbox',         type: 'checked' },
    { id: 'shopt-cdable-vars-checkbox',      type: 'checked' },
];

function saveState() {
    const state = {};
    persistableFields.forEach(({ id, type }) => {
        state[id] = type === 'checked' ? el(id).checked : el(id).value;
    });
    // Save radio button states
    state['hostname-type'] = document.querySelector('input[name="hostname-type"]:checked')?.value || 'full';
    state['directory-type'] = document.querySelector('input[name="directory-type"]:checked')?.value || 'full';
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const state = JSON.parse(raw);
        persistableFields.forEach(({ id, type }) => {
            if (state[id] === undefined) return;
            if (type === 'checked') {
                el(id).checked = Boolean(state[id]);
            } else {
                el(id).value = state[id];
            }
        });
        // Restore radio buttons
        if (state['hostname-type']) {
            const hostnameRadio = document.getElementById(`prompt-hostname-${state['hostname-type']}`);
            if (hostnameRadio) hostnameRadio.checked = true;
        }
        if (state['directory-type']) {
            const directoryRadio = document.getElementById(`prompt-directory-${state['directory-type']}`);
            if (directoryRadio) directoryRadio.checked = true;
        }
    } catch (_) {
        localStorage.removeItem(STORAGE_KEY);
    }
}

// ── Prompt Builder ───────────────────────────────────────────────────────────
function generatePS1() {
    const parts = [];
    const colorMap = {
        '0;30': '#000', '0;31': '#a00', '0;32': '#0a0', '0;33': '#a50',
        '0;34': '#00a', '0;35': '#a0a', '0;36': '#0aa', '0;37': '#aaa',
        '1;30': '#555', '1;31': '#f55', '1;32': '#5f5', '1;33': '#ff5',
        '1;34': '#55f', '1;35': '#f5f', '1;36': '#5ff', '1;37': '#fff',
    };

    const wrapColor = (code) => code ? `\\[\\e[${code}m\\]` : '';
    const resetColor = '\\[\\e[0m\\]';
    
    let previewHTML = '';
    
    // Newline
    if (chk('prompt-newline-checkbox')) {
        parts.push('\\n');
        previewHTML += '<br>';
    }

    // Timestamp
    if (chk('prompt-time-checkbox')) {
        const timeFmt = val('prompt-time-format') || '%H:%M:%S';
        parts.push(`\\[\\D{${timeFmt}}\\]`);
        previewHTML += `<span style="color:#aaa">${new Date().toLocaleTimeString()}</span> `;
    }

    // Exit code
    if (chk('prompt-exitcode-checkbox')) {
        parts.push('\\[$([ $? -eq 0 ] || echo "\\e[0;31m[$?] \\e[0m")\\]');
        previewHTML += '<span style="color:#f55">[1]</span> ';
    }

    // Username
    if (chk('prompt-username-checkbox')) {
        const userColor = val('prompt-color-username');
        parts.push(wrapColor(userColor) + '\\u' + resetColor);
        const htmlColor = colorMap[userColor] || '#fff';
        previewHTML += `<span style="color:${htmlColor}">user</span>`;
    }

    // Separator
    const separator = val('prompt-separator-main') || '@';
    if (chk('prompt-username-checkbox') && chk('prompt-hostname-checkbox')) {
        parts.push(separator);
        previewHTML += separator;
    }

    // Hostname
    if (chk('prompt-hostname-checkbox')) {
        const hostnameType = document.querySelector('input[name="hostname-type"]:checked')?.value;
        const hostColor = val('prompt-color-hostname');
        const hostCode = hostnameType === 'short' ? '\\h' : '\\H';
        parts.push(wrapColor(hostColor) + hostCode + resetColor);
        const htmlColor = colorMap[hostColor] || '#fff';
        const hostName = hostnameType === 'short' ? 'hostname' : 'hostname.domain';
        previewHTML += `<span style="color:${htmlColor}">${hostName}</span>`;
    }

    // Path separator
    const pathSep = val('prompt-separator-path') || ':';
    if ((chk('prompt-username-checkbox') || chk('prompt-hostname-checkbox')) && chk('prompt-directory-checkbox')) {
        parts.push(pathSep);
        previewHTML += pathSep;
    }

    // Directory
    if (chk('prompt-directory-checkbox')) {
        const dirType = document.querySelector('input[name="directory-type"]:checked')?.value;
        const dirColor = val('prompt-color-directory');
        const dirCode = dirType === 'basename' ? '\\W' : '\\w';
        parts.push(wrapColor(dirColor) + dirCode + resetColor);
        const htmlColor = colorMap[dirColor] || '#fff';
        const dirName = dirType === 'basename' ? 'project' : '~/work/project';
        previewHTML += `<span style="color:${htmlColor}">${dirName}</span>`;
    }


    // Symbol
    const symbolInput = val('prompt-symbol-input') || '$';
    const useRootSymbol = chk('prompt-symbol-root-checkbox');
    if (useRootSymbol) {
        parts.push(' \\$ ');
        previewHTML += ' $ ';
    } else {
        parts.push(` ${symbolInput} `);
        previewHTML += ` ${symbolInput} `;
    }

    const ps1 = parts.join('');
    el('prompt-preview-text').innerHTML = previewHTML;
    return ps1;
}

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

    // PS1 Prompt
    const ps1 = generatePS1();
    const prompt_output = ps1 ? `export PS1='${ps1}'` : null;

    // PATH Management
    const path_prepend = val('path-prepend-input');
    const path_append = val('path-append-input');
    const path_strings = [];
    if (path_prepend) {
        path_strings.push(`export PATH="${path_prepend}:$PATH"`);
    }
    if (path_append) {
        path_strings.push(`export PATH="$PATH:${path_append}"`);
    }

    // Shell Options (shopt)
    const shopt_options = [
        [chk('shopt-globstar-checkbox'),      'globstar'],
        [chk('shopt-extglob-checkbox'),       'extglob'],
        [chk('shopt-nocaseglob-checkbox'),    'nocaseglob'],
        [chk('shopt-autocd-checkbox'),        'autocd'],
        [chk('shopt-cdspell-checkbox'),       'cdspell'],
        [chk('shopt-dirspell-checkbox'),      'dirspell'],
        [chk('shopt-dotglob-checkbox'),       'dotglob'],
        [chk('shopt-nullglob-checkbox'),      'nullglob'],
        [chk('shopt-cdable-vars-checkbox'),   'cdable_vars'],
    ];
    const shopt_strings = shopt_options.filter(([enabled]) => enabled).map(([, opt]) => `shopt -s ${opt}`);

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
    if (prompt_output) {
        generated_results.push('\n# Custom Prompt');
        generated_results.push(prompt_output);
    }
    if (path_strings.length > 0) {
        generated_results.push('\n# PATH Management');
        generated_results.push(path_strings.join('\n'));
    }
    if (shopt_strings.length > 0) {
        generated_results.push('\n# Shell Options');
        generated_results.push(shopt_strings.join('\n'));
    }

    el('generated-bashrc').value = generated_results.join('\n');
    saveState();
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
    'prompt-username-checkbox', 'prompt-hostname-checkbox', 'prompt-directory-checkbox',
    'prompt-exitcode-checkbox', 'prompt-time-checkbox',
    'prompt-symbol-root-checkbox', 'prompt-newline-checkbox',
    'prompt-time-format', 'prompt-symbol-input',
    'prompt-color-username', 'prompt-color-hostname', 'prompt-color-directory',
    'prompt-separator-main', 'prompt-separator-path',
    'prompt-hostname-full', 'prompt-hostname-short',
    'prompt-directory-full', 'prompt-directory-basename',
    'path-prepend-input', 'path-append-input',
    'shopt-globstar-checkbox', 'shopt-extglob-checkbox', 'shopt-nocaseglob-checkbox',
    'shopt-autocd-checkbox', 'shopt-cdspell-checkbox', 'shopt-dirspell-checkbox',
    'shopt-dotglob-checkbox', 'shopt-nullglob-checkbox', 'shopt-cdable-vars-checkbox',
];
livePreviewIds.forEach(id => {
    el(id).addEventListener('input',  generateBashrc);
    el(id).addEventListener('change', generateBashrc);
});

// ── Select All / Deselect All per tab ────────────────────────────────────────
function setAllCheckboxes(paneId, state) {
    document.querySelectorAll(`#${paneId} input[type="checkbox"]`).forEach(cb => {
        cb.checked = state;
    });
    generateBashrc();
}

on('history-select-all',   () => setAllCheckboxes('history-pane', true));
on('history-deselect-all', () => setAllCheckboxes('history-pane', false));
on('aliases-select-all',   () => setAllCheckboxes('aliases-pane', true));
on('aliases-deselect-all', () => setAllCheckboxes('aliases-pane', false));
on('options-select-all',   () => setAllCheckboxes('options-pane', true));
on('options-deselect-all', () => setAllCheckboxes('options-pane', false));
on('prompt-select-all',    () => setAllCheckboxes('prompt-pane', true));
on('prompt-deselect-all',  () => setAllCheckboxes('prompt-pane', false));
on('advanced-select-all',  () => setAllCheckboxes('advanced-pane', true));
on('advanced-deselect-all',() => setAllCheckboxes('advanced-pane', false));

// ── Reset All ────────────────────────────────────────────────────────────────
on('reset-all-button', function () {
    // Clear every text / number input inside the tab panels
    document.querySelectorAll('#configTabsContent input[type="text"], #configTabsContent input[type="number"]')
        .forEach(input => { input.value = ''; });
    // Restore all checkboxes to their default (all on)
    document.querySelectorAll('#configTabsContent input[type="checkbox"]')
        .forEach(cb => { cb.checked = true; });
    generateBashrc();
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
loadState();
generateBashrc();
