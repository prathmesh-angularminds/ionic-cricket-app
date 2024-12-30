export interface Player {
    id?: "",
    isSelected?: boolean,
    teamName?: string,
    firstName: string,
    lastName: string,
    fullName: string,
    playerType: string,
    jerseyNumber: string,
    match: number,
    battingDetails: {
        bestScore: number,
        four: number,
        run: number,
        six: number,
        strikeRate: number,
    },
    bowlingDetails: {
        economy: number,
        mostWicket: number,
        noBall: number,
        over: number,
        run: number,
        wicket: number,
    },
    fieldingDetails: {
        catch: number,
        catchDroped: number,
        catchTaken: number,
        fieldingAvg: number,
        runOutAttempt: number,
    }
}