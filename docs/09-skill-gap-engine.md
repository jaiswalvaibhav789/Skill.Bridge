# 09. Mathematical Skill Gap Analysis Engine

> **Subsystem:** Diagnostic Competency Vector Comparison & Remediation  
> **Core Formula:** $\text{Deficit}(k) = \text{TargetThreshold}(k) - \text{CurrentVerifiedScore}(k)$  
> **Classification:** 5-Tier Criticality Categorization  

---

## 1. Mathematical Formulation

Let a Career Role $R$ have required skills $\{k_1, k_2, \dots, k_m\}$ where each skill $k_i$ specifies:
* A Minimum Benchmark Score: $T(k_i) \in [0, 100]$
* An Importance Weight: $w(k_i) \ge 1.0$

Let a candidate $S$ possess verified skill proficiencies $P(k_i) \in [0, 100]$ (where $P(k_i) = 0$ if the candidate has not acquired or tested the skill).

The **Deficit Vector** for skill $k_i$ is computed as:
$$\text{Deficit}(k_i) = T(k_i) - P(k_i)$$

The **Composite Role Readiness Percentage** is defined as:
$$\text{Readiness} = \text{round}\left( \frac{\sum_{i=1}^m \min(T(k_i), P(k_i)) \cdot w(k_i)}{\sum_{i=1}^m T(k_i) \cdot w(k_i)} \times 100 \right)$$

---

## 2. Categorization Thresholds

| Criticality Tier | Deficit Condition | Clinical / Industrial Meaning | Required Action |
| :--- | :---: | :--- | :--- |
| **Critical** | $\text{Deficit} \ge 30\%$ or Unverified | Fundamental prerequisite missing | Immediate diagnostic testing & foundational course enrollment |
| **High** | $20\% \le \text{Deficit} < 30\%$ | Major practical deficiency | Targeted hands-on workshop or industrial masterclass |
| **Medium** | $10\% \le \text{Deficit} < 20\%$ | Minor knowledge shortfall | Self-paced micro-credential or revision quiz |
| **Low** | $1\% \le \text{Deficit} < 10\%$ | Minor gap | Refresher assessment |
| **Satisfactory** | $\text{Deficit} \le 0\%$ | Candidate meets or exceeds industry standard | Benchmark certified; candidate eligible for direct matching |

---

## 3. Closed-Loop Remediation Workflow

```
[Candidate Views Gap Explorer]
             ↓
[Identifies "Schedule T Ayush GMP" (-40% Deficit)]
             ↓
[Clicks "Enroll Course" / "Take Quiz"]
             ↓
[Completes Masterclass & Passes Certification Quiz]
             ↓
[Profile Skill Proficency Upgraded to 75%]
             ↓
[Role Readiness Jumps from 61% → 88%]
             ↓
[Candidate Unlocks Matched Industry Internships]
```
