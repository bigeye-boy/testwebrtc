import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '../router'
import { tournament_list, overview, get_platform_list, get_language_list } from "@/api/index";

export const useIndexStore = defineStore('index', () => {
    const tournamentlist = ref([])
    const activeTournament = ref(null)
    function getTournamentlist(params) {
        return new Promise((resolve, reject) => {
            tournament_list().then(res => {
                tournamentlist.value = res
                activeTournament.value = res[0]
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })

    }

    const indexOverview = ref(null)
    function getIndexOverview(tournament_id) {
        return new Promise((resolve, reject) => {
            overview({
                tournament_id: tournament_id
            }).then(res => {
                indexOverview.value = res
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    const platform_list = ref([])
    function getPlatformList(tournament_id) {
        return new Promise((resolve, reject) => {
            get_platform_list().then(res => {
                platform_list.value = res
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    const language_list = ref([])
    function getLanguageList(tournament_id) {
        return new Promise((resolve, reject) => {
            get_language_list().then(res => {
                language_list.value = res
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    // ["peek_viewers", "average_viewers", "views", "hours_watched"]
    const dim_list = ref([{
        id: 'Hours Watched',
        name: 'Hours Watched'
    }, {
        id: 'Peak Viewers',
        name: 'Peak Viewers',
    }, {
        id: 'Average Viewers',
        name: 'Average Viewers'
    }, {
        id: 'Views',
        name: 'Views'
        },
        // {
        // id: 'Airtime',
        // name: 'Airtime'
        // }
    ])

    const targetList = ref([
        {
            name: 'Total',
            router: '/Matches',
            id: 'total'
        },
        {
            name: 'Languages',
            router: '/Matches',
            id: 'language'
        },
        {
            name: 'Platforms',
            router: '/Matches',
            id: "platform"
        },
    ]);

    const botCommand = ref(null)
    function setBotCommand(value){
        botCommand.value = value
        if (value.route) {
            router.push({
                name: value.route,
                hash:value.hash?'#'+value.hash:undefined
            })
        }
    }

    return {
        tournamentlist, getTournamentlist, activeTournament, indexOverview, getIndexOverview, getPlatformList, platform_list,
        language_list,
        getLanguageList,
        dim_list,
        targetList,
        botCommand,
        setBotCommand
    }
})