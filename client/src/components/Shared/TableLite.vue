<template>
    <div class="tbl-card shadow-sm rounded">
        <div class="tbl-card-title text-lg font-bold text-slate-600 p-3 bg-slate-100" v-if="title">{{ title }}</div>
        <div class="tbl-card-body">
            <div class="tbl-row">
                <div class="col-sm-12" :class="{
                    'fixed-first-column': isFixedFirstColumn,
                    'fixed-first-second-column': isFixedFirstColumn && hasCheckbox,
                }">
                    <div v-if="isLoading" class="tbl-loading-mask">
                        <div class="tbl-loading-content">
                            <span class="text-gray-50">Loading...</span>
                        </div>
                    </div>
                    <table
                        class="tbl-table tbl-table-hover tbl-table-bordered tbl-table-responsive tbl-table-responsive-sm"
                        ref="localTable" :style="'max-height: ' + maxHeight + 'px;'">
                        <thead class="tbl-thead">
                            <tr class="tbl-thead-tr">
                                <th v-if="hasCheckbox" class="tbl-thead-th tbl-checkbox-th">
                                    <div>
                                        <input type="checkbox" class="tbl-thead-checkbox"
                                            :indeterminate="setting.isIndeterminate" v-model="setting.isCheckAll" />
                                    </div>
                                </th>
                                <th v-for="(col, index) in columns" class="tbl-thead-th" :class="col.headerClasses"
                                    :key="index" :style="Object.assign(
                                        {
                                            width: col.width ? col.width : 'auto',
                                        },
                                        col.headerStyles
                                    )
                                        ">
                                    <div class="tbl-thead-column" :class="{
                                        'tbl-sortable': col.sortable,
                                        'tbl-both': col.sortable,
                                        'tbl-asc': col.sortable && setting.order === col.field && setting.sort === 'asc',
                                        'tbl-desc': col.sortable && setting.order === col.field && setting.sort === 'desc',
                                    }" @click.prevent="col.sortable ? doSort(col.field) : false">
                                        <div v-if="setting.isSlotMode && slots['tbl-header-' + col.field]">
                                            <slot :name="'tbl-header-' + col.field" :index="index" :value="col.label">
                                            </slot>
                                        </div>
                                        <div v-else v-html="col.label"></div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <template v-if="rows.length > 0">
                            <tbody v-if="isStaticMode" class="tbl-tbody"
                                :set="(templateRows = groupingKey == '' ? [localRows] : localRows)">
                                <template v-for="(rows, groupingIndex) in templateRows" :key="groupingIndex">
                                    <tr v-if="groupingKey != ''" class="tbl-tbody-tr tbl-group-tr">
                                        <td :colspan="hasCheckbox ? columns.length + 1 : columns.length"
                                            class="tbl-tbody-td tbl-group-td">
                                            <div class="flex">
                                                <div v-if="hasGroupToggle" class="animation">
                                                    <a :ref="(el) => (toggleButtonRefs[groupingIndex] = el)"
                                                        class="cursor-pointer"
                                                        @click.prevent="toggleGroup(groupingIndex)">▼</a>
                                                </div>
                                                <div class="ml-2" v-html="groupingDisplay
                                                    ? groupingDisplay(groupingIndex)
                                                    : groupingIndex
                                                    "></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-for="(row, i) in rows"
                                        :key="row[setting.keyColumn] ? row[setting.keyColumn] : i" :ref="(el) => {
                                            if (!groupingRowsRefs[groupingIndex]) {
                                                groupingRowsRefs[groupingIndex] = [];
                                            }
                                            groupingRowsRefs[groupingIndex][i] = el;
                                        }
                                            " :name="'tbl-group-' + groupingIndex" class="tbl-tbody-tr" :class="typeof rowClasses === 'function' ? rowClasses(row) : rowClasses
                                                " @mouseenter="addHoverClassToTr" @mouseleave="removeHoverClassFromTr"
                                        @click="$emit('row-clicked', row)">
                                        <td v-if="hasCheckbox" class="tbl-tbody-td tbl-checkbox-td">
                                            <div>
                                                <input type="checkbox" class="tbl-tbody-checkbox" :ref="(el) => {
                                                    rowCheckbox.push(el);
                                                }
                                                    " :value="row[setting.keyColumn]" @click="checked(row, $event)" />
                                            </div>
                                        </td>
                                        <td v-for="(col, j) in columns" :key="j" class="tbl-tbody-td"
                                            :class="['tbl-tbody-td' + j].concat(col.columnClasses)"
                                            :style="col.columnStyles" @mouseover="addVerticalHighlight(j)"
                                            @mouseleave="removeVerticalHighlight(j)">
                                            <div v-if="col.display" v-html="col.display(row)"></div>
                                            <div v-else>
                                                <div v-if="setting.isSlotMode && slots[col.field]">
                                                    <slot :name="col.field" :index="i" :value="row"></slot>
                                                </div>
                                                <span v-else>{{ row[col.field] }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                            <tbody v-else :set="(templateRows = groupingKey == '' ? [rows] : groupingRows)">
                                <template v-for="(rows, groupingIndex, index) in templateRows" :key="groupingIndex">
                                    <tr v-if="groupingKey != ''" class="tbl-tbody-tr tbl-group-tr">
                                        <td :colspan="hasCheckbox ? columns.length + 1 : columns.length"
                                            class="tbl-tbody-td tbl-group-td">
                                            <div class="flex">
                                                <div v-if="hasGroupToggle" class="animation">
                                                    <a :ref="(el) => (toggleButtonRefs[groupingIndex] = el)"
                                                        class="cursor-pointer"
                                                        @click.prevent="toggleGroup(groupingIndex)">▼</a>
                                                </div>
                                                <div class="ml-2" v-html="groupingDisplay
                                                    ? groupingDisplay(groupingIndex)
                                                    : groupingIndex
                                                    "></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-for="(row, i) in rows" :ref="(el) => {
                                        if (!groupingRowsRefs[groupingIndex]) {
                                            groupingRowsRefs[groupingIndex] = [];
                                        }
                                        groupingRowsRefs[groupingIndex][i] = el;
                                    }
                                        " :name="'tbl-group-' + groupingIndex"
                                        :key="row[setting.keyColumn] ? row[setting.keyColumn] : i" class="tbl-tbody-tr"
                                        :class="typeof rowClasses === 'function' ? rowClasses(row) : rowClasses
                                            " @mouseenter="addHoverClassToTr" @mouseleave="removeHoverClassFromTr"
                                        @click="$emit('row-clicked', row)">
                                        <td v-if="hasCheckbox" class="tbl-tbody-td tbl-checkbox-td">
                                            <div>
                                                <input type="checkbox" class="tbl-tbody-checkbox" :ref="(el) => {
                                                    rowCheckbox.push(el);
                                                }
                                                    " :value="row[setting.keyColumn]" @click="checked(row, $event)" />
                                            </div>
                                        </td>
                                        <td v-for="(col, j) in columns" :key="j" class="tbl-tbody-td"
                                            :class="['tbl-tbody-td' + j].concat(col.columnClasses)"
                                            :style="col.columnStyles" @mouseover="addVerticalHighlight(j)"
                                            @mouseleave="removeVerticalHighlight(j)">
                                            <div v-if="col.display" v-html="col.display(row)"></div>
                                            <div v-else>
                                                <div v-if="setting.isSlotMode && slots[col.field]">
                                                    <slot :name="col.field" :index="index" :childIndex="i" :value="row">
                                                    </slot>
                                                </div>
                                                <span v-else>{{ row[col.field] }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </template>
                    </table>
                </div>
            </div>
            <div class="tbl-paging tbl-row" v-if="rows.length > 0">
                <template v-if="!setting.isHidePaging">
                    <div class="tbl-paging-info col-sm-12 col-md-4">
                        <div role="status" aria-live="polite">
                            {{
                                stringFormat(messages.pagingInfo, setting.offset, setting.limit, total)
                            }}
                        </div>
                    </div>
                    <div class="tbl-paging-change-div col-sm-12 col-md-4">
                        <span class="tbl-paging-count-label mx-2">{{ messages.pageSizeChangeLabel }}</span>
                        <select class="tbl-paging-count-dropdown rounded-md text-sm border border-slate-200"
                            v-model="setting.pageSize">
                            <option v-for="pageOption in pageOptions" :value="pageOption.value" :key="pageOption.value">
                                {{ pageOption.text }}
                            </option>
                        </select>
                        <span class="tbl-paging-page-label mx-2">{{ messages.gotoPageLabel }}</span>
                        <select class="tbl-paging-page-dropdown rounded-md text-sm border border-slate-200"
                            v-model="setting.page">
                            <option v-for="n in setting.maxPage" :key="n" :value="parseInt(n)">
                                {{ n }}
                            </option>
                        </select>
                    </div>
                    <div class="tbl-paging-pagination-div col-sm-12 col-md-4">
                        <div class="dataTables_paginate">
                            <ul class="tbl-paging-pagination-ul tbl-pagination">
                                <li class="tbl-paging-pagination-page-li tbl-paging-pagination-page-li-first page-item"
                                    :class="{ disabled: setting.page <= 1 }">
                                    <a class="tbl-paging-pagination-page-link tbl-paging-pagination-page-link-first page-link cursor-pointer"
                                        aria-label="Previous" @click.prevent="setting.page = 1">
                                        <span aria-hidden="true">&laquo;</span>
                                        <span class="sr-only">First</span>
                                    </a>
                                </li>
                                <li class="tbl-paging-pagination-page-li tbl-paging-pagination-page-li-prev page-item"
                                    :class="{ disabled: setting.page <= 1 }">
                                    <a class="tbl-paging-pagination-page-link tbl-paging-pagination-page-link-prev page-link cursor-pointer"
                                        aria-label="Previous" @click.prevent="prevPage">
                                        <span aria-hidden="true">&lt;</span>
                                        <span class="sr-only">Prev</span>
                                    </a>
                                </li>
                                <li class="tbl-paging-pagination-page-li tbl-paging-pagination-page-li-number page-item"
                                    v-for="n in setting.paging" :key="n" :class="{ disabled: setting.page === n }">
                                    <a class="tbl-paging-pagination-page-link tbl-paging-pagination-page-link-number page-link cursor-pointer"
                                        @click.prevent="movePage(n)">{{ n }}</a>
                                </li>
                                <li class="tbl-paging-pagination-page-li tbl-paging-pagination-page-li-next page-item"
                                    :class="{ disabled: setting.page >= setting.maxPage }">
                                    <a class="tbl-paging-pagination-page-link tbl-paging-pagination-page-link-next page-link cursor-pointer"
                                        aria-label="Next" @click.prevent="nextPage">
                                        <span aria-hidden="true">&gt;</span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </li>
                                <li class="tbl-paging-pagination-page-li tbl-paging-pagination-page-li-last page-item"
                                    :class="{ disabled: setting.page >= setting.maxPage }">
                                    <a class="tbl-paging-pagination-page-link tbl-paging-pagination-page-link-last page-link cursor-pointer"
                                        aria-label="Next" @click.prevent="setting.page = setting.maxPage">
                                        <span aria-hidden="true">&raquo;</span>
                                        <span class="sr-only">Last</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
            </div>
            <div class="tbl-row" v-else>
                <div class="tbl-empty-msg col-sm-12 text-center">
                    {{ messages.noDataAvailable }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    defineComponent,
    ref,
    reactive,
    computed,
    watch,
    onBeforeUpdate,
    nextTick,
    onMounted,
} from "vue";

export default defineComponent({
    name: "my-table",
    emits: [
        "return-checked-rows",
        "do-search",
        "is-finished",
        "get-now-page",
        "row-clicked",
        "row-toggled",
    ],
    props: {
        // is data loading
        isLoading: {
            type: Boolean,
            require: true,
        },
        // Whether to perform a re-query
        isReSearch: {
            type: Boolean,
            require: true,
        },
        // Presence of Checkbox
        hasCheckbox: {
            type: Boolean,
            default: false,
        },
        // Checkbox (Returns data type for checked of Checkbox)
        checkedReturnType: {
            type: String,
            default: "key",
        },
        // title
        title: {
            type: String,
            default: "",
        },
        // Fixed first column's position
        isFixedFirstColumn: {
            type: Boolean,
            default: false,
        },
        // Field
        columns: {
            type: Array,
            default: () => {
                return [];
            },
        },
        // data
        rows: {
            type: Array,
            default: () => {
                return [];
            },
        },
        // data row classes
        rowClasses: {
            type: [Array, Function],
            default: () => {
                return [];
            },
        },
        // Display the number of items on one page
        pageSize: {
            type: Number,
            default: 10,
        },
        // Total number of transactions
        total: {
            type: Number,
            default: 100,
        },
        // Current page number
        page: {
            type: Number,
            default: 1,
        },
        // Sort condition
        sortable: {
            type: Object,
            default: () => {
                return {
                    order: "id",
                    sort: "asc",
                };
            },
        },
        // Display text
        messages: {
            type: Object,
            default: () => {
                return {
                    pagingInfo: "Showing {0}-{1} of {2}",
                    pageSizeChangeLabel: "Row count:",
                    gotoPageLabel: "Go to page:",
                    noDataAvailable: "No data",
                };
            },
        },
        // Static mode(no refresh server data
        isStaticMode: {
            type: Boolean,
            default: false,
        },
        // V-slot mode
        isSlotMode: {
            type: Boolean,
            default: false,
        },
        // Hide paging
        isHidePaging: {
            type: Boolean,
            default: false,
        },
        // Dropdown of Display the number of items on one page
        pageOptions: {
            type: Array,
            default: () => [
                {
                    value: 10,
                    text: 10,
                },
                {
                    value: 25,
                    text: 25,
                },
                {
                    value: 50,
                    text: 50,
                },
            ],
        },
        // Key of grouping
        groupingKey: {
            type: String,
            default: "",
        },
        // Has hide group rows toggle
        hasGroupToggle: {
            type: Boolean,
            default: false,
        },
        // Customize grouping title
        groupingDisplay: {
            type: Function,
            default: null,
        },
        // Table's max height
        maxHeight: {
            default: "auto",
        },
        // Grouping collapsed on start
        startCollapsed: {
            type: Boolean,
            default: false,
        },
        // Keep collapsed status after refresh
        isKeepCollapsed: {
            type: Boolean,
            default: false,
        },
        // Vertical highlight switch
        isVerticalHighlight: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit, slots }) {
        let localTable = ref(null);

        // Validate dropdown's values have page-size value or not
        let defaultPageSize =
            props.pageOptions.length > 0
                ? ref(props.pageOptions[0].value)
                : ref(props.pageSize);
        if (props.pageOptions.length > 0) {
            props.pageOptions.forEach((v) => {
                if (
                    Object.prototype.hasOwnProperty.call(v, "value") &&
                    Object.prototype.hasOwnProperty.call(v, "text") &&
                    props.pageSize == v.value
                ) {
                    defaultPageSize.value = v.value;
                }
            });
        }

        // Internal set value for components
        const setting = reactive({
            isSlotMode: props.isSlotMode,
            isCheckAll: false,
            isIndeterminate: false,
            isHidePaging: props.isHidePaging,
            keyColumn: computed(() => {
                let key = "";
                Object.assign(props.columns).forEach((col) => {
                    if (col.isKey) {
                        key = col.field;
                    }
                });
                return key;
            }),
            page: props.page,
            pageSize: defaultPageSize.value,
            maxPage: computed(() => {
                if (props.total <= 0) {
                    return 0;
                }
                let maxPage = Math.floor(props.total / setting.pageSize);
                let mod = props.total % setting.pageSize;
                if (mod > 0) {
                    maxPage++;
                }
                return maxPage;
            }),
            offset: computed(() => {
                return (setting.page - 1) * setting.pageSize + 1;
            }),
            limit: computed(() => {
                let limit = setting.page * setting.pageSize;
                return props.total >= limit ? limit : props.total;
            }),
            paging: computed(() => {
                let startPage = setting.page - 2 <= 0 ? 1 : setting.page - 2;
                if (setting.maxPage - setting.page <= 2) {
                    startPage = setting.maxPage - 4;
                }
                startPage = startPage <= 0 ? 1 : startPage;
                let pages = [];
                for (let i = startPage; i <= setting.maxPage; i++) {
                    if (pages.length < 5) {
                        pages.push(i);
                    }
                }
                return pages;
            }),
            order: props.sortable.order,
            sort: props.sortable.sort,
            pageOptions: props.pageOptions,
            isVerticalHighlight: props.isVerticalHighlight,
        });

        // Checked rows
        const isChecked = ref([]);

        // Data rows for local
        const localRows = computed(() => {
            let rows = props.rows;
            var collator = new Intl.Collator(undefined, {
                numeric: true,
                sensitivity: "base",
            });
            let sortOrder = setting.sort === "desc" ? -1 : 1;
            rows.sort(function (a, b) {
                return collator.compare(a[setting.order], b[setting.order]) * sortOrder;
            });

            let result = null;
            if (props.groupingKey) {
                // If have set grouping-key create group temp data
                let tmp = {};
                rows.forEach((v) => {
                    if (!tmp[v[props.groupingKey]]) {
                        tmp[v[props.groupingKey]] = [];
                    }
                    tmp[v[props.groupingKey]].push(v);
                });

                result = {};
                for (let index = setting.offset - 1; index < setting.limit; index++) {
                    result[rows[index][props.groupingKey]] = tmp[rows[index][props.groupingKey]];
                }
            } else {
                result = [];
                for (let index = setting.offset - 1; index < setting.limit; index++) {
                    result.push(rows[index]);
                }
            }

            nextTick(function () {
                callIsFinished();
            });

            return result;
        });

        // Checkbox (Define Checkbox reference)
        const rowCheckbox = ref([]);

        onBeforeUpdate(() => {
            rowCheckbox.value = [];
        });

        watch(
            () => setting.isCheckAll,
            (state) => {
                if (props.hasCheckbox) {
                    setting.isIndeterminate = false;
                    isChecked.value = [];
                    if (state) {
                        let tmpRows = (props.isStaticMode) ? props.rows.slice((setting.offset - 1), setting.limit) : props.rows;
                        if (props.checkedReturnType == "row") {
                            isChecked.value = tmpRows;
                        } else {
                            tmpRows.forEach((val) => {
                                isChecked.value.push(val[setting.keyColumn]);
                            });
                        }
                    }
                    rowCheckbox.value.forEach((val) => {
                        if (val) {
                            val.checked = state;
                        }
                    });
                    emit("return-checked-rows", isChecked.value);
                }
            }
        );

        watch(
            () => props.hasCheckbox,
            (v) => {
                if (!v) {
                    setting.isCheckAll = false;
                }
            }
        );

        const checked = (row, event) => {
            event.stopPropagation();
            setting.isIndeterminate = false;
            let checkboxValue = row[setting.keyColumn];
            if (props.checkedReturnType == "row") {
                checkboxValue = row;
            }
            if (event.target.checked) {
                isChecked.value.push(checkboxValue);
            } else {
                const index = isChecked.value.indexOf(checkboxValue);
                if (index >= 0) {
                    isChecked.value.splice(index, 1);
                }
            }
            if (isChecked.value.length == props.rows.length) {
                if (setting.isCheckAll) {
                    emit("return-checked-rows", isChecked.value);
                }
                setting.isCheckAll = true;
            } else {
                if (isChecked.value.length > 0) {
                    setting.isIndeterminate = true;
                }
                emit("return-checked-rows", isChecked.value);
            }
        };

        const clearChecked = () => {
            isChecked.value = [];
            rowCheckbox.value.forEach((val) => {
                if (val && val.checked) {
                    val.checked = false;
                }
            });
            emit("return-checked-rows", isChecked.value);
        };

        const doSort = (order) => {
            let sort = "asc";
            if (order == setting.order) {
                if (setting.sort == "asc") {
                    sort = "desc";
                }
            }
            let offset = (setting.page - 1) * setting.pageSize;
            let limit = setting.pageSize;
            setting.order = order;
            setting.sort = sort;
            emit("do-search", offset, limit, order, sort);

            if (setting.isCheckAll) {
                setting.isCheckAll = false;
            } else {
                if (props.hasCheckbox) {
                    clearChecked();
                }
            }
        };

        const changePage = (page, prevPage) => {
            setting.isCheckAll = false;
            setting.isIndeterminate = false;
            if (props.hasCheckbox) {
                isChecked.value = [];
            }
            let order = setting.order;
            let sort = setting.sort;
            let offset = (page - 1) * setting.pageSize;
            let limit = setting.pageSize;
            if (!props.isReSearch || page > 1 || page == prevPage) {
                emit("do-search", offset, limit, order, sort);
            }
        };
        watch(() => setting.page, changePage);
        watch(
            () => props.page,
            (val) => {
                if (val <= 1) {
                    setting.page = 1;
                    emit("get-now-page", setting.page);
                } else if (val >= setting.maxPage) {
                    setting.page = setting.maxPage;
                    emit("get-now-page", setting.page);
                } else {
                    setting.page = val;
                }
            }
        );

        const changePageSize = () => {
            if (setting.page === 1) {
                changePage(setting.page, setting.page);
            } else {
                setting.page = 1;
                setting.isCheckAll = false;
                setting.isIndeterminate = false;
            }
        };
        watch(() => setting.pageSize, changePageSize);
        watch(
            () => props.pageSize,
            (newPageSize) => {
                setting.pageSize = newPageSize;
            }
        );

        const prevPage = () => {
            if (setting.page == 1) {
                return false;
            }
            setting.page--;
        };

        const movePage = (page) => {
            setting.page = page;
        };

        const nextPage = () => {
            if (setting.page >= setting.maxPage) {
                return false;
            }
            setting.page++;
        };

        watch(
            () => props.rows,
            () => {
                if (props.isReSearch || props.isStaticMode) {
                    setting.page = 1;
                }
                nextTick(function () {
                    if (!props.isStaticMode) {
                        callIsFinished();
                    }
                });
            },
            { deep: true }
        );

        const stringFormat = (template, ...args) => {
            return template.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != "undefined" ? args[number] : match;
            });
        };

        const callIsFinished = () => {
            if (localTable.value) {
                let localElement = localTable.value.getElementsByClassName("is-rows-el");
                emit("is-finished", localElement);
            }
            emit("get-now-page", setting.page);
        };

        const toggleButtonRefs = ref({});
        const groupingRowsRefs = ref({});
        const groupingToggleStatus = ref({});

        const groupingRows = computed(() => {
            let result = {};
            props.rows.forEach((v) => {
                if (!result[v[props.groupingKey]]) {
                    result[v[props.groupingKey]] = [];
                }
                result[v[props.groupingKey]].push(v);
            });

            nextTick(function () {
                if (props.startCollapsed || props.isKeepCollapsed) {
                    for (const [groupIndex, el] of Object.entries(toggleButtonRefs.value)) {
                        if (el) {
                            let isOpen = !props.startCollapsed;
                            if (
                                props.isKeepCollapsed &&
                                groupingToggleStatus.value[groupIndex] !== undefined
                            ) {
                                isOpen = !groupingToggleStatus.value[groupIndex];
                            }
                            if (
                                (isOpen && el.parentElement.classList.contains("rotated-90")) ||
                                (!isOpen && !el.parentElement.classList.contains("rotated-90"))
                            ) {
                                el.parentElement.classList.toggle("rotated-90");
                            }
                            if (!isOpen) {
                                groupingRowsRefs.value[groupIndex].forEach((element) => {
                                    if (element) {
                                        element.classList.add("hidden");
                                    }
                                });
                            }
                        }
                    }
                }
                callIsFinished();
            });

            return result;
        });

        const toggleGroup = (groupIndex) => {
            let targetEl = toggleButtonRefs.value[groupIndex];
            if (targetEl) {
                targetEl.parentElement.classList.toggle("rotated-90");
                const isClose = targetEl.parentElement.classList.contains("rotated-90");
                groupingRowsRefs.value[groupIndex].forEach((element) => {
                    if (element) {
                        if (isClose) {
                            element.classList.add("hidden");
                        } else {
                            element.classList.remove("hidden");
                        }
                    }
                });
                groupingToggleStatus.value[groupIndex] = isClose;
                emit("row-toggled", groupingRows.value[groupIndex], isClose);
            }
        };

        const addHoverClassToTr = (mouseEvent) => {
            mouseEvent.target.classList.add("hover");
        };

        const removeHoverClassFromTr = (mouseEvent) => {
            mouseEvent.target.classList.remove("hover");
        };

        const addVerticalHighlight = (index) => {
            if (!setting.isVerticalHighlight) {
                return;
            }
            let elements = localTable.value.querySelectorAll(".tbl-tbody-td" + index);
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add("hover");
            }
        };

        const removeVerticalHighlight = (index) => {
            if (!setting.isVerticalHighlight) {
                return;
            }
            let elements = localTable.value.querySelectorAll(".tbl-tbody-td" + index);
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove("hover");
            }
        };

        onMounted(() => {
            nextTick(() => {
                if (props.rows.length > 0) {
                    callIsFinished();
                }
            });
        });

        return {
            slots,
            localTable,
            localRows,
            setting,
            rowCheckbox,
            checked,
            clearChecked,
            doSort,
            prevPage,
            movePage,
            nextPage,
            stringFormat,
            toggleButtonRefs,
            groupingRowsRefs,
            groupingRows,
            toggleGroup,
            addHoverClassToTr,
            removeHoverClassFromTr,
            addVerticalHighlight,
            removeVerticalHighlight,
        };
    },
});
</script>

<style scoped>
.tbl-checkbox-th {
    width: 1%;
    min-width: 38px;
}

.tbl-checkbox-td {
    width: 1%;
    min-width: 38px;
}

.tbl-both {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAAAkElEQVQoz7X QMQ5AQBCF4dWQSJxC5wwax1Cq1e7BAdxD5SL+Tq/QCM1oNiJidwox0355mXnG/DrEtIQ6azioNZQxI0ykPhTQIwhCR+BmBYtlK7kLJYwWCcJA9M4qdrZrd8pPjZWPtOqdRQy320YSV17OatFC4euts6z39GYMKRPCTKY9UnPQ6P+GtMRfGtPnBCiqhAeJPmkqAAAAAElFTkSuQmCC");
}

.tbl-sortable {
    cursor: pointer;
    background-position: right;
    background-repeat: no-repeat;
    padding-right: 30px !important;
}

.tbl-asc {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAZ0lEQVQ4y2NgGLKgquEuFxBPAGI2ahhWCsS/gDibUoO0gPgxEP8H4ttArEyuQYxAPBdqEAxPBImTY5gjEL9DM+wTENuQahAvEO9DMwiGdwAxOymGJQLxTyD+jgWDxCMZRsEoGAVoAADeemwtPcZI2wAAAABJRU5ErkJggg==);
}

.tbl-desc {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAZUlEQVQ4y2NgGAWjYBSggaqGu5FA/BOIv2PBIPFEUgxjB+IdQPwfC94HxLykus4GiD+hGfQOiB3J8SojEE9EM2wuSJzcsFMG4ttQgx4DsRalkZENxL+AuJQaMcsGxBOAmGvopk8AVz1sLZgg0bsAAAAASUVORK5CYII=);
}

.tbl-loading-mask {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #020202bf;
    display: flex;
    flex-flow: column;
    transition: opacity 0.3s ease;
}

.tbl-loading-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tbl-card {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    padding: 1.5rem;
    z-index: 0;
}

.tbl-table {
    width: 100%;
    margin-bottom: 1.25rem;
    color: #464646;
    font-size: small;
    border-collapse: collapse;
}

.tbl-table-bordered thead td,
.tbl-table-bordered thead th {
    border-bottom-width: 2px;
}

.tbl-table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}

.tbl-table-bordered td,
.tbl-table-bordered th {
    border: 1px solid #dee2e6;
}

.tbl-table td,
.tbl-table th {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
    vertical-align: middle;
}

.tbl-table-hover tbody tr:hover {
    color: #212529;
    background-color: #ececec;
}

.tbl-table-responsive {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.tbl-table-responsive>.tbl-table-bordered {
    border: 0;
}

.tbl-row {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    font-size: small;
}

.tbl-pagination {
    margin: 2px 0;
    white-space: nowrap;
    justify-content: flex-end;
    display: -ms-flexbox;
    display: flex;
    padding-left: 0;
    list-style: none;
    border-radius: 0.25rem;
}

.page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    cursor: auto;
    background-color: #fff;
    border-color: #dee2e6;
}

.page-item:first-child .page-link {
    margin-left: 0;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
}

.page-link {
    position: relative;
    display: block;
    padding: 0.5rem 0.75rem;
    margin-left: -1px;
    line-height: 1.25;
    color: #007bff;
    background-color: #fff;
    border: 1px solid #dee2e6;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.col-sm-12 {
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%;
}

@media (min-width: 576px) {
    .tbl-table-responsive-sm {
        display: block;
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .tbl-table-responsive-sm>.table-bordered {
        border: 0;
    }

    .col-md-4 {
        -ms-flex: 0 0 33.333333%;
        flex: 0 0 33.333333%;
        max-width: 33.333333%;
    }
}

.tbl-table thead th {
    position: sticky;
    top: 0;
    z-index: 1;
}

.tbl-table tbody th {
    position: sticky;
    left: 0;
    z-index: 1;
}

.fixed-first-column {
    overflow-x: auto;
}

.fixed-first-column tr th:first-child {
    position: sticky;
    left: 0;
    z-index: 2;
}

.fixed-first-column tr td:first-child {
    position: sticky;
    left: 0;
}

.fixed-first-column tr th:first-child::before,
.fixed-first-second-column tr th:nth-child(2)::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 102%;
    height: 102%;
}

.fixed-first-column tr .tbl-checkbox-th:first-child::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 103%;
    height: 102%;
}

.fixed-first-column tr td:first-child::before,
.fixed-first-column tr td:nth-child(2)::before {
    content: "";
    position: absolute;
    border-right: 1px solid #dee2e6;
    left: 0;
    top: 0;
    width: 102%;
    height: 102%;
}

.fixed-first-column tr .tbl-checkbox-td:first-child::before {
    content: "";
    position: absolute;
    border-right: 1px solid #dee2e6;
    left: 0;
    top: 0;
    width: 103%;
    height: 102%;
}

.fixed-first-second-column tr th:nth-child(2),
.fixed-first-second-column tr td:nth-child(2) {
    position: sticky;
    left: 38px;
}

.fixed-first-second-column tr th:nth-child(2) {
    z-index: 2;
}

.fixed-first-column tr td:first-child,
.fixed-first-second-column tr td:nth-child(2) {
    background-color: white;
}

.fixed-first-column tr.hover td:first-child,
.fixed-first-second-column tr.hover td:nth-child(2) {
    background-color: #ececec;
}

.animation {
    transform: rotate(0deg);
    transition: transform 0.3s;
}

.tbl-tbody-td.hover {
    background-color: #ececec;
}
</style>