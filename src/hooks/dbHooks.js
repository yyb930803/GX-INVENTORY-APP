import SQLite from 'react-native-sqlite-storage';

export const DB = SQLite.openDatabase(
    {
        name: 'scandata.db',
        createFromLocation: 1,
    },
    () => { },
    error => { console.log(error) }
);

export const tbName = (userId) => {
    const scandataTb = 'scandata_tb' + userId;
    const inventoryReviewTb = 'inventory_review_tb' + userId;
    const differenceSurveyTb = 'difference_survey_tb' + userId;
    const inventoryMasterTb = 'inventoryMaster_tb' + userId;
    const generalMasterTb = 'generalMaster_tb' + userId;
    const categoryMasterTb = 'categorymaster_tb' + userId;
    const gongweiMasterTb = 'gongweiMaster_tb' + userId;

    return {
        scandataTb,
        inventoryReviewTb,
        differenceSurveyTb,
        inventoryMasterTb,
        generalMasterTb,
        categoryMasterTb,
        gongweiMasterTb,
    }
};

export const createTable = async (userId) => {
    const { scandataTb, inventoryReviewTb, differenceSurveyTb, inventoryMasterTb, generalMasterTb, categoryMasterTb, gongweiMasterTb } = tbName(userId);

    DB.transaction(function (txn) {
        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${scandataTb}(
                record_id varchar(255),
                scan_time varchar(255),
                commodity_sku varchar(255),
                pihao varchar(255), 
                gongwei_id INTEGER,
                row INTEGER,
                column INTEGER,
                codeinput_method varchar(255), 
                delete_flag INTEGER,
                count INTEGER, 
                mistakes_id varchar(255), 
                mistakes_type varchar(255),
                commodity_price varchar(255),
                upload varchar(255),
                commodity_name varchar(255)
            )`,
            []
        );

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${categoryMasterTb}(
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
                a_category_code varchar(255), 
                a_category_name varchar(255), 
                b_category_code varchar(255), 
                b_category_name varchar(255),
                c_category_code varchar(255), 
                c_category_name varchar(255)
            )`,
            []
        );

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${differenceSurveyTb}(
                record_id varchar(255),
                scan_time varchar(255),
                commodity_sku varchar(255),
                pihao varchar(255), 
                gongwei_id INTEGER,
                row INTEGER,
                column INTEGER,
                codeinput_method varchar(255), 
                delete_flag INTEGER,
                count INTEGER, 
                mistakes_id varchar(255), 
                mistakes_type varchar(255),
                commodity_price varchar(255),
                upload TEXT
            )`,
            []
        );

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${generalMasterTb}(
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
                commodity_code VARCHAR(255), 
                commodity_sku VARCHAR(255), 
                commodity_price VARCHAR(255), 
                commodity_name VARCHAR(255), 
                major_code VARCHAR(255), 
                color_code VARCHAR(255),
                size_code VARCHAR(255), 
                unit VARCHAR(255),
                CONSTRAINT unique_commodity UNIQUE (commodity_code, commodity_sku)
            ); 
            CREATE INDEX IF NOT EXISTS idx_generalMaster_tb ON ${generalMasterTb}(
                commodity_code, commodity_sku
            )`,
            []
        );

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${inventoryReviewTb}(
                record_id varchar(255),
                scan_time varchar(255),
                commodity_sku varchar(255),
                pihao varchar(255),
                gongwei_id INTEGER,
                row INTEGER,
                column INTEGER,
                codeinput_method varchar(255), 
                delete_flag INTEGER,
                count INTEGER, 
                mistakes_id varchar(255), 
                mistakes_type varchar(255),
                commodity_price TEXT,
                upload TEXT,
                commodity_name varchar(255)
            )`,
            []
        );

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${inventoryMasterTb}(
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
                commodity_code VARCHAR(255), 
                commodity_sku VARCHAR(255),
                commodity_price VARCHAR(255), 
                commodity_name VARCHAR(255), 
                major_code VARCHAR(255), 
                color_code VARCHAR(255),
                size_code VARCHAR(255), 
                count INTEGER, 
                unit VARCHAR(255),
                CONSTRAINT unique_commodity UNIQUE (commodity_code, commodity_sku)
            );
            CREATE INDEX IF NOT EXISTS idx_inventoryMaster_tb ON ${inventoryMasterTb}(
                commodity_code, commodity_sku
            )`,
            []
        );

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${gongweiMasterTb}(
                id INTEGER PRIMARY KEY NOT NULL,
                pianqu varchar(255),
                gongwei varchar(255)
            )`,
            []
        );
    });
};

export const deleteTable = (userId) => {
    const { scandataTb, inventoryReviewTb, differenceSurveyTb, inventoryMasterTb, generalMasterTb, categoryMasterTb, gongweiMasterTb } = tbName(userId);

    DB.transaction((tx) => {
        tx.executeSql(`DELETE FROM ${scandataTb}`, [], (tx, results) => { });
        tx.executeSql(`DELETE FROM ${inventoryReviewTb}`, [], (tx, results) => { });
        tx.executeSql(`DELETE FROM ${differenceSurveyTb}`, [], (tx, results) => { });
        tx.executeSql(`DELETE FROM ${inventoryMasterTb}`, [], (txn, results) => { });
        tx.executeSql(`DELETE FROM ${generalMasterTb}`, [], (txn, results) => { });
        tx.executeSql(`DELETE FROM ${gongweiMasterTb}`, [], (txn, results) => { });
        tx.executeSql(`DELETE FROM ${categoryMasterTb}`, [], (txn, results) => { });
    });
};

// ====================================================

export const getInvNewData = (userId) => {
    const { scandataTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(
                `
                    SELECT record_id, commodity_sku, count, gongwei_id, column, row, delete_flag, scan_time, codeinput_method, pihao 
                    FROM ${scandataTb} WHERE upload = "new"
                `,
                [],
                (tx, results) => {
                    let list = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        list.push(results.rows.item(i));
                    }
                    resolve(list);
                },
                (tx, error) => {
                    reject(error);
                },
            );
        });
    });
};

export const getRevNewData = (userId) => {
    const { inventoryReviewTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(
                `
                    SELECT record_id, commodity_sku, count, gongwei_id, column, row, delete_flag, scan_time, codeinput_method, pihao, mistakes_id, mistakes_type 
                    FROM ${inventoryReviewTb} WHERE upload = "new"
                `,
                [],
                (tx, results) => {
                    let list = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        list.push(results.rows.item(i));
                    }
                    resolve(list);
                },
                (tx, error) => {
                    reject(error);
                },
            );
        });
    });
};

export const getDiffNewData = (userId) => {
    const { differenceSurveyTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(
                `
                    SELECT record_id, commodity_sku, count, gongwei_id, column, row, delete_flag, scan_time, codeinput_method, pihao 
                    FROM ${differenceSurveyTb} WHERE upload = "new"
                `,
                [],
                (tx, results) => {
                    let list = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        list.push(results.rows.item(i));
                    }
                    resolve(list);
                },
                (tx, error) => {
                    reject(error);
                },
            );
        });
    });
};

export const getInvNewGongweiData = (userId, gongweiId) => {
    const { scandataTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(
                `
                    SELECT record_id, commodity_sku, count, gongwei_id, column, row, delete_flag, scan_time, codeinput_method, pihao 
                    FROM ${scandataTb} WHERE upload = "new" AND gongwei_id=?
                `,
                [gongweiId],
                (tx, results) => {
                    let list = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        list.push(results.rows.item(i));
                    }
                    resolve(list);
                },
                (tx, error) => {
                    reject(error);
                },
            );
        });
    });
};

// =====================================================

export const getGenMtCount = async (userId) => {
    const { generalMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(
                `SELECT COUNT(*) as count FROM ${generalMasterTb}`,
                [],
                (tx, results) => {
                    const count = results.rows.item(0).count;
                    resolve(count);
                },
                (tx, error) => {
                    reject(error);
                },
            );
        });
    });
};

export const getCatMtCount = async (userId) => {
    const { categoryMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(
                `SELECT COUNT(*) as count FROM ${categoryMasterTb}`,
                [],
                (tx, results) => {
                    const count = results.rows.item(0).count;
                    resolve(count);
                },
                (tx, error) => {
                    reject(error);
                },
            );
        });
    });
};

export const getInvMtCount = async (userId) => {
    const { inventoryMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(
                `SELECT COUNT(*) as count FROM ${inventoryMasterTb}`,
                [],
                (tx, results) => {
                    const count = results.rows.item(0).count;
                    resolve(count);
                },
                (tx, error) => {
                    reject(error);
                },
            );
        });
    });
};

export const getGongMtCount = async (userId) => {
    const { gongweiMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(
                `SELECT COUNT(*) as count FROM ${gongweiMasterTb}`,
                [],
                (tx, results) => {
                    const count = results.rows.item(0).count;
                    resolve(count);
                },
                (tx, error) => {
                    reject(error);
                },
            );
        });
    });
};

// =====================================================

export const insertGenMt = (userId, data) => {
    const { generalMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(`DELETE FROM ${generalMasterTb}`, [], (tx, results) => { });
            for (let i = 0; i < data.length; i++) {
                tx.executeSql(
                    `INSERT INTO ${generalMasterTb} ("commodity_code", "commodity_sku", "commodity_name", "commodity_price", "major_code", "size_code","color_code", "unit") VALUES (?,?,?,?,?,?,?,?)`,
                    [
                        data[i].commodity_code,
                        data[i].commodity_sku,
                        data[i].commodity_name,
                        data[i].commodity_price,
                        data[i].major_code,
                        data[i].size_code,
                        data[i].color_code,
                        data[i].unit,
                    ],
                    (tx, results) => {
                        resolve(results);
                    },
                    (tx, error) => {
                        reject(error);
                    },
                );
            }
        });
    });
};

export const insertInvMt = async (userId, data) => {
    const { inventoryMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(`DELETE FROM ${inventoryMasterTb}`, [], (tx, results) => { });
            for (let i = 0; i < data.length; i++) {
                tx.executeSql(
                    `INSERT INTO ${inventoryMasterTb} ("commodity_code", "commodity_sku", "commodity_name", "commodity_price", "major_code", "size_code", "color_code","count", "unit") VALUES (?,?,?,?,?,?,?,?,?)`,
                    [
                        data[i].commodity_code,
                        data[i].commodity_sku,
                        data[i].commodity_name,
                        data[i].commodity_price,
                        data[i].major_code,
                        data[i].size_code,
                        data[i].color_code,
                        data[i].count,
                        data[i].unit,
                    ],
                    (tx, results) => {
                        resolve(results);
                    },
                    (tx, error) => {
                        reject(error);
                    },
                );
            }
        });
    });
};

export const insertCatMt = (userId, data) => {
    const { categoryMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(`DELETE FROM ${categoryMasterTb}`, [], (tx, results) => { });
            for (let i = 0; i < data.length; i++) {
                tx.executeSql(
                    `INSERT INTO ${categoryMasterTb} ("id", "a_category_code", "a_category_name", "b_category_code", "b_category_name", "c_category_code", "c_category_name") VALUES (?,?,?,?,?,?,?)`,
                    [
                        data[i].id,
                        data[i].a_category_code,
                        data[i].a_category_name,
                        data[i].b_category_code,
                        data[i].b_category_name,
                        data[i].c_category_code,
                        data[i].c_category_name,
                    ],
                    (tx, results) => {
                        resolve(results);
                    },
                    (tx, error) => {
                        reject(error);
                    },
                );
            }
        });
    });
};

export const insertGongMt = (userId, data) => {
    const { gongweiMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(`DELETE FROM ${gongweiMasterTb}`, [], (tx, results) => { });
            for (let i = 0; i < data.length; i++) {
                tx.executeSql(
                    `INSERT INTO ${gongweiMasterTb} ("id", "pianqu", "gongwei") VALUES (?,?,?)`,
                    [
                        data[i].id,
                        data[i].pianqu,
                        data[i].gongwei,
                    ],
                    (tx, results) => {
                        resolve(results);
                    },
                    (tx, error) => {
                        reject(error);
                    },
                );
            }
        });
    });
};

// =====================================================

export const getPianquList = async (userId) => {
    const { gongweiMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((tx) => {
            tx.executeSql(
                `SELECT DISTINCT pianqu FROM ${gongweiMasterTb}`,
                [],
                (tx, results) => {
                    let list = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        let temp = {};
                        temp.label = results.rows.item(i).pianqu;
                        temp.value = results.rows.item(i).pianqu;
                        list.push(temp);
                    }
                    resolve(list);
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const pipeiSKU = async (commoditySku, userId) => {
    const { inventoryMasterTb, generalMasterTb, categoryMasterTb } = tbName(userId);

    return new Promise((resolve, reject) => {
        DB.transaction((txn) => {
            txn.executeSql(
                `
                    SELECT im.*, cm.a_category_name 
                    FROM ${inventoryMasterTb} im
                    LEFT JOIN ${categoryMasterTb} cm ON im.major_code = cm.a_category_code
                    WHERE im.commodity_sku = ? OR im.commodity_code = ?
                `,
                [commoditySku, commoditySku],
                (txn, results) => {
                    if (results.rows.length > 0) {
                        resolve(results.rows.item(0));
                    } else {
                        txn.executeSql(
                            `
                                SELECT gm.*, cm.a_category_name 
                                FROM ${generalMasterTb} gm
                                LEFT JOIN ${categoryMasterTb} cm ON gm.major_code = cm.a_category_code
                                WHERE gm.commodity_sku = ? OR gm.commodity_code = ?
                            `,
                            [commoditySku, commoditySku],
                            (txn, results) => {
                                if (results.rows.length > 0) {
                                    resolve(results.rows.item(0));
                                } else {
                                    resolve(null);
                                }
                            },
                            (tx, error) => {
                                reject(error);
                            }
                        );
                    }
                },
                (tx, error) => {
                    reject(error);
                }
            );
        })
    });
};

export const insertDifferenceSurvey = (userId, data) => {
    const { inventoryMasterTb, generalMasterTb, differenceSurveyTb } = tbName(userId);

    DB.transaction((txn) => {
        txn.executeSql(
            `DELETE FROM ${differenceSurveyTb}`,
            [],
            (txn, results) => { },
        );
        for (let i = 0; i < data.length; i++) {
            var commodity_price = '';
            txn.executeSql(
                `SELECT commodity_price FROM ${inventoryMasterTb} WHERE commodity_sku = ?`,
                [data[i].commodity_sku],
                (txn, results) => {
                    if (results.rows.length > 0) {
                        commodity_price = results.rows.item(0).commodity_price;
                    } else {
                        txn.executeSql(
                            `SELECT commodity_price FROM ${generalMasterTb} WHERE commodity_sku = ?`,
                            [data[i].commodity_sku],
                            (txn, results) => {
                                if (results.rows.length > 0) {
                                    commodity_price = results.rows.item(0).commodity_price;
                                }
                            },
                        );
                    }
                },
            );
            txn.executeSql(
                `INSERT INTO ${differenceSurveyTb} (
                        "record_id",
                        "commodity_sku",
                        "commodity_price",
                        "codeinput_method",
                        "pihao",
                        "count",
                        "column",
                        "row",
                        "scan_time",
                        "delete_flag",
                        "gongwei_id",
                        "upload"
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,"uploaded")`,
                [
                    data[i].record_id,
                    data[i].commodity_sku,
                    commodity_price,
                    data[i].codeinput_method,
                    data[i].pihao,
                    data[i].count,
                    data[i].column,
                    data[i].row,
                    data[i].scan_time,
                    data[i].delete_flag,
                    data[i].gongwei_id
                ],
                (txn, results) => {
                },
            );
        }
    });
};
