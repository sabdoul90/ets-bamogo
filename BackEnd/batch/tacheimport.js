const cron = require("node-cron");
const { Import, Media } = require("../models");
const { lancerImport } = require("../batch/execution_import");

function commencerImport() {
    cron.schedule("*/5 * * * *", async () => {
        console.log("-------Vérification des imports en attente...-------");

        const imports = await Import.findAll(
            {
                where: { statut: "a faire" },
                include: [
                    {
                        model: Media,
                        as: "media"
                    }]
            },
        );

        if (imports.length === 0) {
            console.log("Aucun import à executer : ", imports);
        } else {
            console.log("imporrts : ", imports);
            for (const imp of imports) {
                try {
                    imp.statut = "en cours";
                    await imp.save();

                    const journalId = await lancerImport(imp);

                    imp.statut = "termine";
                    imp.journal = journalId;
                    await imp.save();
                } catch (err) {
                    imp.statut = "echec";
                    await imp.save();
                    console.error(`Import ${imp.id} échoué :`, err);
                }
            }
        }
    });
}

module.exports = { commencerImport };
