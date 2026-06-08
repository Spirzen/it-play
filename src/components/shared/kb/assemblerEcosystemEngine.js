/** Данные для AssemblerEcosystemPlay — статья 5-16-starye-yazyki/assembler/3. */

export const TABS = [
  {id: 'stack', label: 'Слои архитектуры'},
  {id: 'deps', label: 'Граф связей'},
  {id: 'structure', label: 'Структура проекта'},
  {id: 'build', label: 'Сборка и линковка'},
  {id: 'modules', label: 'Модели линковки'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'hardware',
    tag: 'Железо',
    label: 'CPU · ISA · память',
    color: '#64748b',
    icon: '🔩',
    items: ['x86-64 · ARM · RISC-V', 'Регистры · стек · флаги', 'Сегменты / плоская модель'],
    detail:
      'Ассемблер — зеркало ISA: каждая мнемоника отображается в машинную команду. Регистры RAX–R15, RSP/RBP, RFLAGS и модель памяти задают, как вы адресуете данные и вызываете код.',
  },
  {
    id: 'language',
    tag: 'Язык',
    label: 'Мнемоники и директивы',
    color: '#0ea5e9',
    icon: '📝',
    items: ['MOV · CALL · RET · syscall', '.data · .bss · .text', '%macro · equ · global'],
    detail:
      'Инструкции исполняет CPU; директивы обрабатывает ассемблер: секции ELF, резерв памяти (db/dw/dd), экспорт _start, подключение других модулей через extern/global.',
  },
  {
    id: 'toolchain',
    tag: 'Toolchain',
    label: 'Ассемблер и препроцессор',
    color: '#8b5cf6',
    icon: '⚙',
    items: ['NASM · GAS · MASM · Yasm', '-f elf64 / win64 / macho64', 'Intel vs AT&T синтаксис'],
    detail:
      'NASM — популярен в учебниках (Intel). GAS — стандарт GNU, синтаксис AT&T. Выход: объектный файл (.o) с секциями .text/.data и таблицей символов — без libc и без точки входа ОС.',
  },
  {
    id: 'object',
    tag: 'Объектник',
    label: 'ELF · COFF · Mach-O',
    color: '#f59e0b',
    icon: '📦',
    items: ['main.o · utils.o', 'Символы: global / extern', 'relocations · .o без запуска'],
    detail:
      'Каждый .asm → отдельный .o. Неразрешённые ссылки (вызов printf, метка в другом файле) остаются relocations до этапа линковки. objdump -d / readelf -s показывают секции и символы.',
  },
  {
    id: 'linker',
    tag: 'Линкер',
    label: 'ld · gcc · link.exe',
    color: '#10b981',
    icon: '🔗',
    items: ['Статическая · динамическая', 'crt0.o / crtbegin.o', '-T linker.ld (embedded)'],
    detail:
      'Линкер склеивает .o, подставляет адреса, подключает CRT (_start → main) и библиотеки. gcc main.o -o app прячет вызов ld; для чистого ASM: ld -dynamic-linker ... -lc -o app main.o.',
  },
  {
    id: 'runtime',
    tag: 'Runtime / ОС',
    label: 'libc · syscalls · Win32',
    color: '#ec4899',
    icon: '🖥',
    items: ['syscall (Linux x86-64)', 'kernel32.dll · user32.dll', 'libm · pthread · custom .a'],
    detail:
      'Linux: номер в RAX, аргументы в RDI, RSI…, затем syscall. Windows: импорт из DLL через таблицу IAT. libc даёт printf/exit; без неё — только прямые syscalls или bare metal.',
  },
  {
    id: 'app',
    tag: 'Программа',
    label: 'Ваши модули .asm',
    color: '#6366f1',
    icon: '🏗',
    items: ['main.asm · utils.asm', 'drivers · boot · hot paths', 'вставки в C/C++ (.S)'],
    detail:
      'Один файл — учебный hello. Реальный проект: несколько модулей, Makefile/CMake, общие заголовки equ/структур, опционально гибрид с C через calling convention System V AMD64.',
  },
];

export const DEP_NODES = [
  {id: 'main', label: 'main.asm', type: 'app', x: 200, y: 22},
  {id: 'utils', label: 'utils.asm', type: 'module', x: 85, y: 88},
  {id: 'simd', label: 'simd.asm', type: 'lazy', x: 315, y: 88},
  {id: 'crt0', label: 'crt0.o (_start)', type: 'module', x: 200, y: 152},
  {id: 'libc', label: 'libc.so / -lc', type: 'lib', x: 70, y: 210},
  {id: 'libm', label: 'libm (-lm)', type: 'lib', x: 200, y: 210},
  {id: 'libcustom', label: 'libcrypto.a', type: 'lib', x: 330, y: 210},
];

export const DEP_EDGES = [
  ['main', 'utils'],
  ['main', 'simd'],
  ['main', 'crt0'],
  ['utils', 'libc'],
  ['utils', 'libm'],
  ['main', 'libc'],
  ['crt0', 'libc'],
  ['simd', 'libcustom'],
  ['main', 'libcustom'],
];

export const NODE_TYPE_META = {
  app: {label: 'Главный модуль', stroke: '#6366f1'},
  module: {label: 'Другой .asm / CRT', stroke: '#10b981'},
  lazy: {label: 'Опциональный модуль', stroke: '#f59e0b', dash: '6 4'},
  lib: {label: 'Библиотека / .so / .a', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'linux-syscall',
    label: 'Linux x86-64 (syscall)',
    toolchain: 'NASM -f elf64 · ld · без libc · прямой write/exit',
    tree: [
      {
        type: 'dir',
        path: 'hello-syscall',
        children: [
          {type: 'file', path: 'hello-syscall/main.asm', role: 'Единственный модуль', hint: 'section .data, .text; global _start; mov rax,1 (write); mov rax,60 (exit); syscall'},
          {type: 'file', path: 'hello-syscall/Makefile', role: 'Сборка', hint: 'nasm -f elf64 main.asm -o main.o\nld main.o -o hello'},
          {type: 'file', path: 'hello-syscall/hello', role: 'ELF executable', hint: 'readelf -h · objdump -d hello — только ваш код, без libc'},
        ],
      },
    ],
  },
  {
    id: 'multi-module',
    label: 'Мульти-модуль + libc',
    toolchain: 'NASM · gcc (линковка) · utils.asm · printf из libc',
    tree: [
      {
        type: 'dir',
        path: 'calc-app',
        children: [
          {type: 'file', path: 'calc-app/Makefile', role: 'Оркестрация', hint: 'AS=nasm · LD=gcc · all: main.o utils.o → gcc -o calc'},
          {type: 'file', path: 'calc-app/main.asm', role: 'Точка входа', hint: 'global main · extern add64 · call add64 · extern printf · call printf@plt'},
          {
            type: 'dir',
            path: 'calc-app/src',
            children: [
              {type: 'file', path: 'calc-app/src/utils.asm', role: 'Библиотека функций', hint: 'global add64 · section .text · add64: ... ret'},
              {type: 'file', path: 'calc-app/src/constants.inc', role: 'Общие equ', hint: '%include "constants.inc" — макросы и константы для обоих .asm'},
            ],
          },
          {type: 'file', path: 'calc-app/build/main.o', role: 'Объектник', hint: 'nm main.o — U printf, U add64, T main'},
          {type: 'file', path: 'calc-app/build/utils.o', role: 'Объектник', hint: 'T add64 — символ экспортирован для линкера'},
          {type: 'file', path: 'calc-app/calc', role: 'Исполняемый файл', hint: 'ldd calc → libc.so.6 — динамическая линковка через gcc'},
        ],
      },
    ],
  },
  {
    id: 'win-pe',
    label: 'Windows PE + DLL',
    toolchain: 'NASM win64 · link.exe · kernel32.dll · ExitProcess',
    tree: [
      {
        type: 'dir',
        path: 'win-app',
        children: [
          {type: 'file', path: 'win-app/main.asm', role: 'Win64 entry', hint: 'extern GetStdHandle · extern WriteConsoleA · extern ExitProcess · sub rsp,28h (shadow space)'},
          {type: 'file', path: 'win-app/build.bat', role: 'Сборка', hint: 'nasm -f win64 main.asm -o main.obj\nlink /subsystem:console main.obj kernel32.lib'},
          {type: 'file', path: 'win-app/main.obj', role: 'COFF object', hint: 'dumpbin /symbols main.obj — импорты из DLL'},
          {type: 'file', path: 'win-app/main.exe', role: 'PE executable', hint: 'Таблица импорта → kernel32.dll; не syscall, а Win32 API'},
        ],
      },
    ],
  },
  {
    id: 'hybrid-c',
    label: 'Гибрид C + ASM',
    toolchain: 'System V AMD64 · .S для GAS · extern "C" из C',
    tree: [
      {
        type: 'dir',
        path: 'hybrid',
        children: [
          {type: 'file', path: 'hybrid/Makefile', role: 'Сборка', hint: 'gcc -c main.c · as -o fast.o fast.S · gcc main.o fast.o -o app'},
          {type: 'file', path: 'hybrid/main.c', role: 'Высокий уровень', hint: 'extern int64_t dot_product(...); вызывает оптимизированную ASM-функцию'},
          {type: 'file', path: 'hybrid/fast.S', role: 'GAS · AT&T', hint: '.global dot_product · сохранение RBX на стек · цикл по элементам'},
          {type: 'file', path: 'hybrid/fast.o', role: 'Объектник', hint: 'Символ dot_product виден линкеру; соглашение: RDI, RSI, RDX — первые аргументы'},
          {type: 'file', path: 'hybrid/app', role: 'Бинарник', hint: 'C runtime + ваша SIMD-рутина в одном процессе'},
        ],
      },
    ],
  },
  {
    id: 'embedded',
    label: 'Embedded / bare metal',
    toolchain: 'NASM -f bin · linker script · без ОС',
    tree: [
      {
        type: 'dir',
        path: 'firmware',
        children: [
          {type: 'file', path: 'firmware/boot.asm', role: 'Точка сброса', hint: 'org 0x7C00 · cli · настройка сегментов · jmp load_kernel'},
          {type: 'file', path: 'firmware/drivers/uart.asm', role: 'Драйвер', hint: 'global uart_putc · прямой доступ к MMIO-портам'},
          {type: 'file', path: 'firmware/linker.ld', role: 'Карта памяти', hint: 'SECTIONS { .text 0x08000000 : { *(.text*) } }'},
          {type: 'file', path: 'firmware/Makefile', role: 'Сборка', hint: 'nasm -f elf32 · ld -T linker.ld -nostdlib boot.o uart.o -o firmware.elf'},
          {type: 'file', path: 'firmware/firmware.bin', role: 'Прошивка', hint: 'objcopy -O binary — без libc, syscalls и CRT'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'preprocess',
    label: 'Препроцессор',
    cmd: '%include "constants.inc"\n%macro push_callee 1\n    push %1\n%endmacro\n\nnasm -E main.asm > main.i',
    detail: '%include подставляет файлы; %macro разворачивает шаблоны. -E показывает результат до генерации объектника — удобно отлаживать макросы.',
  },
  {
    id: 'assemble',
    label: 'Ассемблирование',
    cmd: 'nasm -f elf64 -g -F dwarf main.asm -o build/main.o\nnasm -f elf64 src/utils.asm -o build/utils.o',
    detail: '-f задаёт формат (elf64, win64, macho64, bin). -g добавляет отладочные символы для GDB. На выходе — relocations и таблица символов global/extern.',
  },
  {
    id: 'link',
    label: 'Линковка',
    cmd: '# Минимальный ELF без libc:\nld -o hello build/main.o\n\n# С libc через gcc:\ngcc build/main.o build/utils.o -o calc -no-pie\n\n# Явно:\nld -dynamic-linker /lib64/ld-linux-x86-64.so.2 \\\n   -o calc build/main.o build/utils.o -lc',
    detail: 'Линкер разрешает extern → global, подключает crt0 (_start вызывает main), подставляет адреса PLT/GOT для динамических библиотек.',
  },
  {
    id: 'inspect',
    label: 'Анализ',
    cmd: 'readelf -h calc          # заголовок ELF\nreadelf -S calc          # секции .text .data .bss\nnm -u calc               # неопределённые символы\nobjdump -d -M intel calc   # дизассемблирование\nldd calc                 # libm.so.6, libc.so.6',
    detail: 'Перед отладкой убедитесь, что символы разрешены (nm без "U" для нужных имён). objdump показывает, как директивы превратились в машинный код.',
  },
  {
    id: 'debug',
    label: 'Отладка',
    cmd: 'gdb ./calc\n(gdb) break main\n(gdb) run\n(gdb) info registers\n(gdb) x/8gx $rsp    # стек\n(gdb) si            # шаг по инструкции',
    detail: 'С флагом -g GDB знает соответствие строк .asm и адресов. Полезно смотреть RSP/RBP, флаги после CMP и содержимое стека при CALL/RET.',
  },
  {
    id: 'run',
    label: 'Запуск',
    cmd: './calc\nstrace ./calc 2>&1 | head   # какие syscalls\n\n# Windows:\nmain.exe\n dumpbin /imports main.exe',
    detail: 'strace показывает цепочку write/mmap/brk через libc или прямой syscall. На Windows — импорты из kernel32/ucrtbase вместо syscall-номеров Linux.',
  },
];

export const LINK_MODELS = [
  {
    id: 'bare',
    label: 'Bare / syscall only',
    era: 'Минимум · учебный hello',
    color: '#64748b',
    syntax: `section .data
    msg db "Hi", 10
    len equ $ - msg

section .text
global _start
_start:
    mov rax, 1          ; write
    mov rdi, 1          ; stdout
    ; ...
    mov rax, 60         ; exit
    xor rdi, rdi
    syscall`,
    traits: ['Без libc и CRT', '_start вместо main', 'ld main.o -o app'],
    tools: 'nasm · ld · readelf · strace',
    use: 'Bootloader, ядро, первые программы на Linux',
  },
  {
    id: 'dynamic',
    label: 'Динамическая libc',
    era: 'Прикладной ASM + printf',
    color: '#10b981',
    syntax: `extern printf
extern exit

section .text
global main
main:
    lea rdi, [rel fmt]
    xor eax, eax
    call printf wrt ..plt
    call exit

; gcc main.o utils.o -o app`,
    traits: ['PLT/GOT для libc', 'gcc удобнее чистого ld', 'Меньший exe, shared libc'],
    tools: 'gcc · ldd · objdump -R',
    use: 'Утилиты с I/O, мульти-модульные проекты',
  },
  {
    id: 'static',
    label: 'Статическая линковка',
    era: 'Один файл · переносимость',
    color: '#8b5cf6',
    syntax: `gcc -static main.o utils.o -o app
# или
ld -o app main.o utils.o \\
   /usr/lib/x86_64-linux-gnu/crt1.o \\
   -lc --static

# ldd app → not a dynamic executable`,
    traits: ['libc внутри бинарника', 'Больший размер (~MB)', 'Нет зависимости от .so на целевой системе'],
    tools: 'gcc -static · size · strip',
    use: 'Initramfs, embedded Linux, дистрибуция без glibc',
  },
  {
    id: 'static-lib',
    label: 'Статическая .a библиотека',
    era: 'Переиспользуемый ASM-код',
    color: '#f59e0b',
    syntax: `nasm -f elf64 crypto.asm -o crypto.o
ar rcs libcrypto.a crypto.o

# в main.asm:
extern aes_block_encrypt
; ...
gcc main.o -L. -lcrypto -o app`,
    traits: ['ar создаёт .a из .o', 'Линкер копирует только используемые .o', 'Как libm, но свой код'],
    tools: 'ar · nm libcrypto.a · gcc -L',
    use: 'Crypto, SIMD-ядра, общие драйверные процедуры',
  },
  {
    id: 'win-dll',
    label: 'Windows DLL import',
    era: 'PE · Win32 API',
    color: '#ec4899',
    syntax: `default rel
extern ExitProcess
extern MessageBoxA

section .text
main:
    sub rsp, 28h        ; shadow space
    ; MessageBoxA(0, text, caption, 0)
    xor ecx, ecx
    lea rdx, [msg]
    ; ...
    call ExitProcess`,
    traits: ['Импорт из .dll, не syscall', 'x64 shadow space 32 байта', 'link kernel32.lib user32.lib'],
    tools: 'nasm win64 · link.exe · dumpbin',
    use: 'Win32 GUI, системные утилиты под Windows',
  },
];

export function flattenArchFiles(tree, acc = []) {
  for (const node of tree) {
    if (node.type === 'file') acc.push(node);
    if (node.children) flattenArchFiles(node.children, acc);
  }
  return acc;
}

export function getArchPreset(id) {
  return ARCH_PRESETS.find((p) => p.id === id) ?? ARCH_PRESETS[0];
}

export function activeDepEdges(enabledNodeIds) {
  return DEP_EDGES.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes() {
  return new Set(DEP_NODES.map((n) => n.id));
}

export function bundleSummary(enabledNodeIds) {
  const hasSimd = enabledNodeIds.has('simd');
  const libCount = DEP_NODES.filter((n) => n.type === 'lib' && enabledNodeIds.has(n.id)).length;
  const modCount = DEP_NODES.filter((n) => n.type === 'module' && enabledNodeIds.has(n.id)).length;
  const artifacts = hasSimd
    ? [`calc (~24 KB)`, 'SIMD + libcrypto.a', `${modCount} модуля · ${libCount} библиотек`]
    : ['calc (~18 KB)', 'без simd.asm', `${modCount} модуля · ${libCount - 1} библиотек`];
  return {artifacts, hasSimd, libCount, modCount};
}
