"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseBackup = void 0;
const databaseBackup = (db_name, backup_date) => {
    return `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Database Backup Notification</title>
</head>

<body style="
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
    ">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border: 1px solid #eaeaea;
        border-radius: 8px;
        overflow: hidden;
      ">
        <tr>
            <td style="background-color: #2189bb; padding: 20px; text-align: center">
                <h1 style="margin: 0; font-size: 24px; color: #ffffff">
                    ${db_name} Database Backup
                </h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px">
                <p style="margin: 0 0 15px">Hello,</p>
                <p style="margin: 0 0 15px">
                    This is to inform you that a backup of the database has been
                    successfully created.
                </p>
                <p style="margin: 0 0 15px">Below are the details of the backup:</p>
                <table width="100%" cellpadding="5" cellspacing="0" style="border-collapse: collapse">
                    <tr>
                        <td style="
                  font-weight: bold;
                  padding: 8px;
                  border: 1px solid #ddd;
                  background-color: #f2f2f2;
                ">
                            Database Name:
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd">${db_name}</td>
                    </tr>
                    <tr>
                        <td style="
                  font-weight: bold;
                  padding: 8px;
                  border: 1px solid #ddd;
                  background-color: #f2f2f2;
                ">
                            Backup Date:
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd">
                            ${backup_date}
                        </td>
                    </tr>
                    <tr>
                        <td style="
                  font-weight: bold;
                  padding: 8px;
                  border: 1px solid #ddd;
                  background-color: #f2f2f2;
                ">
                            Backup Status:
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd">Completed</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`;
};
exports.databaseBackup = databaseBackup;
