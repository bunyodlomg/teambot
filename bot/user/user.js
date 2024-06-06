const {Lyric, NotFound} = require("../../models/model");

let back = '',
    check_input = {};

const forUser = async (ctx, text, user) => {
    switch (text) {
        case '/start':
            check_input = {};
            await ctx.reply(`Assalomu alaykum. Istalgan qo'shiqchi ismini yoki musiqa nomini yozing. Men sizga musiqa matnini chiqarib beraman.`, {
                // reply_markup: {
                //     keyboard: kb.home
                // }
            })
            back = ''
            break;

        default:
            searchLyric(ctx, text, 0,10);
            break;
    }

}

async function searchLyric(ctx, text, skip, limit) {
    // Ensure skip and limit are valid numbers
    skip = Number.isInteger(skip) ? Math.max(0, skip) : 0;
    limit = Number.isInteger(limit) ? Math.max(1, limit) : 10;

    const query = {
        $or: [
            { title: { $regex: text, $options: 'i' } },
            { text: { $regex: text, $options: 'i' } },
            { singer: { $regex: text, $options: 'i' } }
        ]
    };

    const count = await Lyric.countDocuments(query);

    if (count === 0) {
        await ctx.api.sendMessage(ctx.from.id, 'Musiqa matnlari topilmadi. Tez orada musiqa matni adminlar tarafida botga qo\'shiladi ', {
            parse_mode: 'HTML'
        });
        const nt = new NotFound();
        nt.text = text;
        nt.user_id = ctx.from.id;
        nt.username = ctx.from.username;
        nt.save()
        return;
    }

    const totalPages = Math.ceil(count / limit);
    skip = Math.min(skip, (totalPages - 1) * limit);

    const lyrics = await Lyric.find(query).skip(skip).limit(limit);

    const currentPage = Math.floor(skip / limit) + 1;
    let message = `Musiqa matnlari ${currentPage}/${totalPages}\n\n`;

    let num = [];
    lyrics.forEach((value, index) => {
        num.push({
            text:index+1,
            callback_data: "music_search_" + value._id,
        })
        message += `${index + 1}. ${value.title}\n`;
    });

    let inline = [];
    if (skip > 0) {
        inline.push({
            text: '⬅️',
            callback_data: `ms_left_${text}_${skip - limit}`,
        });
    }
    if (totalPages > currentPage) {
        inline.push({
            text: '➡️',
            callback_data: `ms_right_${text}_${skip + limit}`,
        });
    }

    let arr1 = num.slice(0, (num.length/2));
    let arr2 = num.slice((num.length/2), (num.length/2) + num.length);

    await ctx.api.sendMessage(ctx.from.id, message, {
        reply_markup: {
            inline_keyboard: [
                arr1,
                arr2,
                inline
            ],
        },
        parse_mode: 'HTML'
    });
}


module.exports = {forUser,searchLyric}