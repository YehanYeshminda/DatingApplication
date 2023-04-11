using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class groupsAddedV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Groups_GroupName",
                table: "Connections");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Connections",
                newName: "UserName");

            migrationBuilder.RenameColumn(
                name: "GroupName",
                table: "Connections",
                newName: "MessageGroupName");

            migrationBuilder.RenameIndex(
                name: "IX_Connections_GroupName",
                table: "Connections",
                newName: "IX_Connections_MessageGroupName");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Groups_MessageGroupName",
                table: "Connections",
                column: "MessageGroupName",
                principalTable: "Groups",
                principalColumn: "Name",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Groups_MessageGroupName",
                table: "Connections");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Connections",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "MessageGroupName",
                table: "Connections",
                newName: "GroupName");

            migrationBuilder.RenameIndex(
                name: "IX_Connections_MessageGroupName",
                table: "Connections",
                newName: "IX_Connections_GroupName");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Groups_GroupName",
                table: "Connections",
                column: "GroupName",
                principalTable: "Groups",
                principalColumn: "Name");
        }
    }
}
