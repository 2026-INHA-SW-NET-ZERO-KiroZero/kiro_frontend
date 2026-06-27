import type { CookingGuideResponse } from '@/types/api/cookingGuide';
import type { DecidedMenu, MenuRole, Purchase, VoteMenu } from '@/types/menu';
import type {
  LatestRecommendationResponse,
  MenuCandidateResponse,
  MenuVoteRequest,
  VoteType,
} from '@/types/session';

export const REGENERATION_VOTE_INDEX = 4;

const CANDIDATE_LABELS = ['A', 'B', 'C', 'D'] as const;

export function menuTypeLabel(menuType: string | undefined): '저탄소' | '일반' {
  return menuType === 'LOW_CARBON' || menuType === '저탄소' ? '저탄소' : '일반';
}

export function plannedFoodWasteText(candidate: MenuCandidateResponse | undefined): string {
  const grams =
    candidate?.usedLeftoverIngredients.reduce(
      (sum, ingredient) => sum + (ingredient.plannedUseGrams ?? 0),
      0,
    ) ?? 0;
  return grams > 0 ? `${Math.round(grams)}g` : '0g';
}

export function buildMenuVoteRequest(
  selectedIndex: number | null,
  voteMenus: VoteMenu[],
  reasonText = '',
): MenuVoteRequest | null {
  if (selectedIndex == null) return null;

  if (selectedIndex === REGENERATION_VOTE_INDEX) {
    const reason = reasonText.trim();
    if (!reason) return null;
    return { voteType: 'E', reasonText: reason };
  }

  const candidateLabel = voteMenus[selectedIndex]?.candidateLabel;
  if (
    !candidateLabel ||
    !CANDIDATE_LABELS.includes(candidateLabel as (typeof CANDIDATE_LABELS)[number])
  ) {
    return null;
  }

  return {
    voteType: candidateLabel as VoteType,
    candidateLabel,
  };
}

export function toDecidedMenu(
  latest: LatestRecommendationResponse,
  cookingGuide: CookingGuideResponse | null = null,
  myParticipantId?: number | null,
): DecidedMenu | null {
  if (latest.selectedMenu == null) return null;

  const selectedCandidate = latest.candidates.find(
    (candidate) => candidate.candidateLabel === latest.selectedMenu?.candidateLabel,
  );

  return {
    name: latest.selectedMenu.menuName,
    emoji: menuTypeLabel(latest.selectedMenu.menuType) === '저탄소' ? '🥬' : '🍳',
    type: menuTypeLabel(latest.selectedMenu.menuType),
    time: selectedCandidate ? `${selectedCandidate.cookingTimeMinutes}분` : '-',
    servings: '4인분',
    co2: plannedFoodWasteText(selectedCandidate),
    votes: '투표 확정',
    purchase: purchaseFromCandidate(selectedCandidate),
    recipe: recipeFromGuideOrCandidate(cookingGuide, selectedCandidate),
    roles: rolesFromGuideOrCandidate(cookingGuide, selectedCandidate, myParticipantId),
  };
}

function purchaseFromCandidate(candidate: MenuCandidateResponse | undefined): Purchase | null {
  if (candidate == null || candidate.purchaseItems.length === 0) return null;

  return {
    item: candidate.purchaseItems.map((item) => item.name).join(', '),
    buyer: candidate.purchaseItems[0]?.assignedToNickname ?? '',
    cost: `${candidate.purchaseItems.reduce((sum, item) => sum + item.estimatedCost, 0)}원`,
  };
}

function recipeFromGuideOrCandidate(
  cookingGuide: CookingGuideResponse | null,
  candidate: MenuCandidateResponse | undefined,
): string[] {
  if (cookingGuide != null && cookingGuide.steps.length > 0) {
    return cookingGuide.steps.map((step) => `${step.title}: ${step.instruction}`);
  }
  return candidate?.cookingOutlineSteps ?? [];
}

function rolesFromGuideOrCandidate(
  cookingGuide: CookingGuideResponse | null,
  candidate: MenuCandidateResponse | undefined,
  myParticipantId?: number | null,
): MenuRole[] {
  if (cookingGuide != null && cookingGuide.steps.length > 0) {
    const byParticipant = new Map<
      number,
      { nickname: string; firstTaskName: string; steps: string[] }
    >();

    for (const step of cookingGuide.steps) {
      for (const task of step.participantTasks) {
        const current = byParticipant.get(task.participantId) ?? {
          nickname: task.nickname,
          firstTaskName: task.taskName,
          steps: [],
        };
        current.steps.push(task.displayInstruction || task.taskDetail || task.taskName);
        byParticipant.set(task.participantId, current);
      }
    }

    return Array.from(byParticipant.entries()).map(([participantId, role]) => ({
      who: role.nickname,
      role: role.firstTaskName,
      bring: '없음',
      isMe: myParticipantId === participantId,
      steps: role.steps,
    }));
  }

  return (candidate?.rolePlanSummary ?? []).map((role, index) => ({
    who: `참여자 ${index + 1}`,
    role,
    bring: '없음',
    isMe: index === 0,
    steps: [role],
  }));
}
