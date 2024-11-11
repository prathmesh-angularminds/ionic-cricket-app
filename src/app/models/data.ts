import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class Data {
    public allPlayersList: any = [
        {
            id: "01",
            name: "Prathamesh Vibhute",
            isSelected: false,
            teamName: "",
        },
        {
            id: "02",
            name: "Chhatrapti Darekar",
            isSelected: false,
            teamName: "",
        },
        {
            id: "03",
            name: "Gaurav Patekar",
            isSelected: false,
            teamName: "",
        },
        {
            id: "04",
            name: "Gaurav Supalkar",
            isSelected: false,
            teamName: "",
        },
        {
            id: "05",
            name: "Prathamesh Choudhary",
            isSelected: false,
            teamName: "",
        },
        {
            id: "06",
            name: "Deep More",
            isSelected: false,
            teamName: "",
        },
        {
            id: "07",
            name: "Sagar More",
            isSelected: false,
            teamName: "",
        },
        {
            id: "08",
            name: "Akshay",
            isSelected: false,
            teamName: "",
        },
        {
            id: "09",
            name: "Satya Pisal",
            isSelected: false,
            teamName: "",
        },
        {
            id: "10",
            name: "Karan",
            isSelected: false,
            teamName: "",
        }
    ];
    public teamAPlayersList: any;
    public teamBPlayersList: any;
    public overs: any = 0;
}
