import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class Data {
    public isMatchPlayed: boolean = true;
    public allPlayersList: any = [];
    public teamAPlayersList: any = [
        {
            id: "01",
            fullName: "Prathamesh Vibhute",
            firstName: "Prathamesh",
            lastName: "Vibhute",
            isSelected: false,
            teamName: "",
        },
        {
            id: "02",
            fullName: "Chhatrapati Darekar",
            firstName: "Chhatrapati",
            lastName: "Darekar",
            isSelected: false,
            teamName: "",
        },
        {
            id: "03",
            fullName: "Gaurav Patekar",
            firstName: "Gaurav",
            lastName: "Patekar",
            isSelected: false,
            teamName: "",
        },
        {
            id: "04",
            fullName: "Gaurav Supalkar",
            firstName: "Gaurav",
            lastName: "Supalkar",
            isSelected: false,
            teamName: "",
        },
        {
            id: "05",
            fullName: "Prathamesh Choudhary",
            firstName: "Prathamesh",
            lastName: "choudhary",
            isSelected: false,
            teamName: "",
        }
    ];
    public teamBPlayersList: any = [
        {
            id: "06",
            fullName: "Deep More",
            firstName: "Deep",
            lastName: "More",
            isSelected: false,
            teamName: "",
        },
        {
            id: "07",
            fullName: "Sagar More",
            firstName: "Sagar",
            lastName: "More",
            isSelected: false,
            teamName: "",
        },
        {
            id: "08",
            fullName: "Akshay",
            firstName: "Akshay",
            lastName: "",
            isSelected: false,
            teamName: "",
        },
        {
            id: "09",
            fullName: "Satya Pisal",
            firstName: "Satya",
            lastName: "Pisal",
            isSelected: false,
            teamName: "",
        },
        {
            id: "10",
            fullName: "Karan Thite",
            firstName: "Karan",
            lastName: "Thite",
            isSelected: false,
            teamName: "",
        }
    ];
    public overs: any = 4;
    public tossWinningTeam: string = "TEAM A";
    public scoreKeyboard: any = [
        [
            {
                label: "1",
                run: 1,
                type: "RUN",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: true
            },
            {
                label: "6",
                run: 6,
                type: "RUN",
                class: "boundary",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "HW",
                run: 0,
                type: "WICKET",
                class: "wicket",
                isLegalDelivery: true,
                isWicket: true,
                shouldChangeStrike: false
            },
            {
                label: "2 + RO",
                run: 2,
                type: "RUNOUT",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: true
            },
        ], [
            {
                label: "2",
                run: 2,
                type: "RUN",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "2D",
                run: 2,
                type: "RUN",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "W",
                run: 0,
                type: "WICKET",
                class: "wicket",
                isLegalDelivery: true,
                isWicket: true,
                shouldChangeStrike: false
            },
            {
                label: "3 + RO",
                run: 3,
                type: "RUNOUT",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: false
            },
        ], [
            {
                label: "3",
                run: 3,
                type: "RUN",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: true
            },
            {
                label: "WD",
                run: 1,
                type: "WIDE",
                class: "",
                isLegalDelivery: false,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "RO",
                run: 0,
                type: "RUNOUT",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: true
            },
            {
                label: "4 + RO",
                run: 4,
                type: "RUNOUT",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: true
            },
        ], [
            {
                label: "4",
                run: 4,
                type: "RUN",
                class: "boundary",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "CW",
                run: 0,
                type: "WICKET",
                class: "wicket",
                isLegalDelivery: true,
                isWicket: true,
                shouldChangeStrike: false
            },
            {
                label: "1 + RO",
                run: 1,
                type: "RUNOUT",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "0",
                run: 0,
                type: "RUN",
                class: "",
                isLegalDelivery: true,
                isWicket: false,
                shouldChangeStrike: false
            },
        ], [
            {
                label: "NB",
                run: 1,
                type: "NOBALL",
                class: "",
                isLegalDelivery: false,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "1 + NB",
                run: 2,
                type: "NOBALL",
                class: "",
                isLegalDelivery: false,
                isWicket: false,
                shouldChangeStrike: true
            },
            {
                label: "2 + NB",
                run: 3,
                type: "NOBALL",
                class: "",
                isLegalDelivery: false,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "3 + NB",
                run: 4,
                type: "NOBALL",
                class: "",
                isLegalDelivery: false,
                isWicket: false,
                shouldChangeStrike: true
            },
        ], [
            {
                label: "4 + NB",
                run: 5,
                type: "NOBALL",
                class: "",
                isLegalDelivery: false,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "6 + NB",
                run: 7,
                type: "NOBALL",
                class: "",
                isLegalDelivery: false,
                isWicket: false,
                shouldChangeStrike: false
            },
            {
                label: "RD",
                run: 0,
                type: "RETIRED_HURT",
                class: "",
                isLegalDelivery: false,
                isWicket: false,
                shouldChangeStrike: false
            },
        ],
    ]
}
